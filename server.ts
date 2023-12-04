import express from 'express';
import { config as dotEnvConfig } from 'dotenv';
import { router as productRouter } from './routers/products/products.controller';
import { verifyToken } from './middleware/user-authorization';
import { router as cartRouter } from './routers/cart/cart.controller';
import User from './models/user';
import bcrypt from "bcrypt";
import mongoose from 'mongoose';
import * as jwt from "jsonwebtoken";
import { logger } from './logger/logger';
import morgan from 'morgan';

dotEnvConfig();

mongoose.connect(process.env.DB_URL as string);

const db = mongoose.connection;

db.once('open', () => logger.info('connected to db'));

db.on('error', (e) => console.log(e));

const app = express();

app.use(express.json());
app.use(morgan('combined'));

app.post("/api/auth/login", async (req, res) => {
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                { user_id: user._id, email, role: user.role },
                process.env.TOKEN_KEY!,
                {
                    expiresIn: "2h",
                }
            );

            return res.status(200).json({
                token
            });
        }
        res.status(400).send("Invalid Credentials");
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/api/auth/register', async(req, res) => {

    try {
        // Get user input
        const { role, email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }

        // Validate if user already exist in our database
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        await User.create({
            email: email.toLowerCase(),
            password: encryptedPassword,
            role: role === "admin" ? "admin" : "non-admin"
        });

        res.status(201).send("User successfully registered");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }

});

app.use('/api/products', verifyToken, productRouter);
app.use('/api/profile/cart', verifyToken, cartRouter )

let connections: any[] = [];


const server = app.listen(process.env.PORT, () => {
    logger.info('Server started on port' + process.env.PORT)
});

server.on('connection', (connection) => {
    // register connections
    connections.push(connection);
    
    // remove/filter closed connections
    connection.on('close', () => {
      connections = connections.filter((currentConnection) => currentConnection !== connection);
    });
});

function shutdown() {
    logger.info('Received kill signal, shutting down gracefully');
    
    server.close(async () => {
      logger.info('Closed out remaining connections');
      await mongoose.connection.close();
      process.exit(0);
    });
  
    setTimeout(() => {
      logger.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 20000);
  
    // end current connections
    connections.forEach((connection) => connection.end());
    
    // then destroy connections
    setTimeout(() => {
      connections.forEach((connection) => connection.destroy());
    }, 10000);
  }



process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);