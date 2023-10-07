import { NextFunction, Request, Response } from 'express';
import users from '../data/users';

const userAuthenticationMiddleware = (req: Request, resp: Response, next: NextFunction) => {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
        resp.status(403).send({
            "data": null,
            "error": {
              "message": "You must be authorized user"
            }
          });
    } else {
        if (isUserValid(userId)) {
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

const isUserValid: (id: string) => boolean = (id: string) => {
    return !!users.find(user => user.id === id);
}

export default userAuthenticationMiddleware;