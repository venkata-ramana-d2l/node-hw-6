import { NextFunction, Request, Response } from "express";
import { ProductEntity } from "../schemas/product.entity";
import joiSchema from "../schemas/joi.schema";

const updateCartMiddleware = (req: Request<{}, any, { productId?: string, count?: number, product?: ProductEntity }>, resp: Response, next: NextFunction) => {
    const reqBody = req.body;
    console.log(reqBody);
    const { error } = joiSchema.validate(reqBody);
    if (error) {
        resp.status(400).send({
            "data": null,
            "error": {
              "message": "Products are not valid"
            }
          });
    } else {
        next();
    }
}

export default updateCartMiddleware;