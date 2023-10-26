import crypto from 'crypto';
import orders from "../../data/orders";
import { CartEntity } from "../../schemas/cart.entity";
import { OrderEntity } from "../../schemas/order.entity";
import { CartObject } from "./cart.service";
import Cart from '../../models/cart';
import Order from '../../models/order'

export const getCart = async (userId: string) => {
    const cart = await Cart.findOne({userId}).exec();
    return cart;
}

export const createEmptyCart: (userId: string) => any = async (userId: string) => {
    const emptyCart = {
        id: crypto.randomUUID(),
        userId,
        isDeleted: false,
        items: []
    }
    try {
        await Cart.create(emptyCart);
        return emptyCart;
    } catch {
        return false;
    }
}

export const emptyCart: (userId: string) => any = async (userId: string) => {
    try {
        await Cart.findOneAndUpdate({userId}, {items: [], isDeleted: true}, {new: true});
        return true;
    } catch(e) {

    }
}

export const setCart: (userId: string, updatedCart: CartEntity) => void = async (userId: string, updatedCart: CartEntity) => {
    // cart[userId] = {
    //     ...updatedCart
    // }

    return await Cart.updateOne({userId}, updatedCart);
}

export const removeProductFromCart = async (userId: string, productId: string) => {
    const cart = await Cart.findOne({userId});
    // cart?.items.pull({'product.id': productId});
    const productIndex = cart?.items.findIndex((elem) => elem.product.id === productId);
    cart?.items.splice(productIndex as number, 1);
    cart?.save();
    return cart;
}

export const addProductToCart = async (userId: string, productDetails: any) => {
    const cart = await Cart.findOneAndUpdate({userId}, {
        $push: {
            items: {
                count: productDetails.count,
                product: {
                    id: productDetails.product.id,
                    title: productDetails.product.title,
                    description: productDetails.product.description,
                    price: productDetails.product.price
                }
            }
        }
    }, {new: true});
    return cart;
}

export const saveOrder: (userId: string, cartObj: CartObject) => any = async (userId: string, cartObj: CartObject) => {
    const cart =  cartObj.cart;
    const order: OrderEntity = {
        total: cartObj.total,
        cartId: cart.id,
        items: cart.items,
        payment: {
            type: 'online'
        },
        status: 'created',
        delivery: {
            type: 'post',
            address: 'street 2'
        },
        comments: '',
        id: crypto.randomUUID(),
        userId
    };
    console.log(order);
    const createdOrder = await Order.create(order);
    return createdOrder;
}