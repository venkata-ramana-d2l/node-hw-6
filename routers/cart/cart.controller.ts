import express, { Request, Response } from 'express';
import { CartObject, addProduct, createNewCart, createOrder, deleteCart, dropProduct, getUserCart, updateProductCount } from './cart.service';
import updateCartMiddleware from '../../middleware/update-cart';

export const router = express.Router();

router.get('/', async (req: Request, resp: Response) => {
    const userId = req.headers['x-user-id'] as string;
    const cart = await getUserCart(userId);
    let respCart;
    if (cart) {
        respCart = {
            data: cart,
            error: null
        };
    } else {
        respCart = {
            data: await createNewCart(userId),
            error: null
        };
    }

    resp.status(200).send(respCart);

});

router.put('/', updateCartMiddleware, async (req: Request, resp: Response) => {
    const userId = req.headers['x-user-id'] as string;
        if (req.body.count === 0) {
        // drop a product
        const dropProductResult = await dropProduct(userId, req.body.productId);
            if (dropProductResult) {
                resp.status(200).send(dropProductResult);
            } else {
                resp.status(404).send(
                    {
                        "data": null,
                        "error": {
                        "message": "Cart was not found"
                        }
                    }
                );
            }
        } else if (!req.body.product) {
            // update a product
            const updateResult = await updateProductCount(userId, req.body.productId, req.body.count);
            if (updateResult) {
                resp.status(200).send({
                    data: updateResult,
                    error: null
                });
            } else {
                resp.status(404).send(
                    {
                        "data": null,
                        "error": {
                        "message": "Cart was not found"
                        }
                    }
                );
            }
        } else {
            // add a product
            const addResult = await addProduct(userId, req.body);
            if (addResult) {
                resp.status(200).send(addResult);
            } else {
                resp.status(404).send(
                    {
                        "data": null,
                        "error": {
                        "message": "Cart was not found"
                        }
                    }
                );
            }
        }
});

router.delete('/', async (req: Request, resp: Response) => {
    const userId = req.headers['x-user-id'] as string;
    await deleteCart(userId);
    resp.status(200).send({
        "data": {
          "success": true
        },
        "error": null
      });

});

router.post('/checkout', async (req: Request, resp: Response) => {
    const userId = req.headers['x-user-id'] as string;
    const cart = await getUserCart(userId);
    if (!cart || !(cart as CartObject).total) {
        resp.status(400).send({
            "data": null,
            "error": {
              "message": "Cart is empty"
            }
          });
    } else {
        resp.status(200).send(await createOrder(cart as CartObject));
    }

});