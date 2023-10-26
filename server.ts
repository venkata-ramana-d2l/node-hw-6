import express from 'express';
import { config as dotEnvConfig } from 'dotenv';
import { router as productRouter } from './routers/products/products.controller';
import userAuthenticationMiddleware from './middleware/user-authorization';
import { router as cartRouter } from './routers/cart/cart.controller';
import mongoose from 'mongoose';

dotEnvConfig();

mongoose.connect(process.env.DB_URL as string);

const db = mongoose.connection;

db.once('open', () => console.log('connected to db'));

db.on('error', (e) => console.log(e));

const app = express();

app.use(userAuthenticationMiddleware);
app.use(express.json());
app.use('/api/products', productRouter);
app.use('/api/profile/cart', cartRouter )

app.listen(3000, () => {
    console.log('Server is started');
});