import crypto from 'crypto';
import cart from "../../data/cart";
import orders from "../../data/orders";
import { CartEntity } from "../../schemas/cart.entity";
import { OrderEntity } from "../../schemas/order.entity";
import { CartObject } from "./cart.service";
import { ProductEntity } from '../../schemas/product.entity';

export const getCart: (userId: string) => CartEntity = (userId: string) => {
    console.log('final cart', cart);
    return cart[userId]
}

export const createEmptyCart: (userId: string) => void = (userId: string) => {
    cart[userId] = {
        id: crypto.randomUUID(),
        userId,
        isDeleted: false,
        items: []
    }
}

export const emptyCart: (userId: string) => void = (userId: string) => {
    cart[userId] = {
        ...cart[userId],
        items: [],
        isDeleted: true,
    }
}

export const setCart: (userId: string, updatedCart: CartEntity) => void = (userId: string, updatedCart: CartEntity) => {
    cart[userId] = {
        ...updatedCart
    }
}

export const removeProductFromCart = (userId: string, productId: string) => {
    const products = cart[userId].items;
    const finalProducts = products.filter(product => product.product.id !== productId);
    cart[userId].items = finalProducts;
}

export const addProductToCart = (userId: string, productDetails: any) => {
    cart[userId].items.push(
        {
            count: productDetails.count,
            product: {
                id: productDetails.product.id,
                title: productDetails.product.title,
                description: productDetails.product.description,
                price: productDetails.product.price
            }
        }
    );

}

export const saveOrder: (userId: string, cartObj: CartObject) => OrderEntity = (userId: string, cartObj: CartObject) => {
    const cart =  { ...cartObj.cart };
    const order: OrderEntity = {
        total: cartObj.total,
        ...cart,
        cartId: cart.id,
        payment: {
            type: 'online'
        },
        status: 'created',
        delivery: {
            type: 'post',
            address: undefined
        },
        comments: '',
        id: crypto.randomUUID()
    };
    if (!orders[userId]) {
        orders[userId] = [];
    }
    orders[userId].push(order);
    return order;
}