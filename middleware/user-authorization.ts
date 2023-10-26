import { NextFunction, Request, Response } from 'express';
import User from '../models/user';

const userAuthenticationMiddleware = async (req: Request, resp: Response, next: NextFunction) => {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
        resp.status(403).send({
            "data": null,
            "error": {
              "message": "You must be authorized user"
            }
          });
    } else {
        if (await isUserValid(userId)) {
            next();
        } else {
            resp.status(401).send({
                "data": null,
                "error": {
                  "message": "User is not authorized"
                }
              });
        }
    }
}

const isUserValid: (id: string) => any = async (id: string) => {
    return !!await User.findOne({id}).exec();
}

export default userAuthenticationMiddleware;