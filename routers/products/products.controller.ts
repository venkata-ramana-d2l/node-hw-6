import express, { Request, Response } from 'express';
import { getAllProducts, getSingleProduct } from './products.service';

export const router = express.Router();

router.get('/', (req: Request, resp: Response) => {
    const products = getAllProducts();
    resp.status(200).send({
        data: products,
        error: null
    });
});

router.get('/:id', (req: Request<{ id: string }, any, any, any>, resp: Response) => {
    const id = req.params.id;
    const product = getSingleProduct(id);
    if (product) {
        resp.status(200).send({
            data: product,
            error: null
        });
    } else {
        resp.status(404).send({
            data: null,
            error: {
              message: "No product with such id"
            }
        });
    }
});