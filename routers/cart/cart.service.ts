import { CartEntity, CartItemEntity } from "../../schemas/cart.entity";
import { OrderEntity } from "../../schemas/order.entity";
import { getCart, setCart, createEmptyCart, emptyCart, saveOrder, removeProductFromCart, addProductToCart } from "./cart.repository";

export type CartObject = { cart: CartEntity, total: number };

const calculateTotal: (items: CartItemEntity[]) => number = (items: CartItemEntity[]) => {
    let total = 0;
    items.forEach(item => total+= item.product.price * item.count);
    return total;
}

export const getUserCart: (userId: string) => CartObject | boolean = (userId: string) => {
    const cart  = getCart(userId);
    if (cart && !cart.isDeleted) {
        const total = calculateTotal(cart.items);
        return {
            cart: { ...cart },
            total
        }
    }
    return false;
};

export const createNewCart: (userId: string) => { cart: CartEntity, total: number } = (userId: string) => {
    console.log('yess');
    createEmptyCart(userId);
    return {
        cart: { ...getCart(userId) },
        total: 0
    }
}

export const deleteCart: (userId: string) => void = (userId: string) => {
    emptyCart(userId);
}

export const dropProduct: (userId: string, productId: string) => CartObject | boolean = (userId: string, productId: string) => {
    removeProductFromCart(userId, productId);
    return getUserCart(userId);
}

export const addProduct: (userId: string, productDetails: any) => CartObject | boolean = (userId: string, productDetails: any) => {
    addProductToCart(userId, productDetails);
    return getUserCart(userId);
}

export const updateProductCount: (userId: string, productId: string, count: number) => CartObject | boolean = (userId: string, productId: string, count: number ) => {
    const userCartObject = getUserCart(userId);
    if (userCartObject) {
        const userCart = (userCartObject as CartObject).cart;
        const itemIndex = userCart.items.findIndex(item => item.product.id === productId);
        if (itemIndex > -1) {
            userCart.items[itemIndex].count = count;
            setCart(userId, userCart);
            return getUserCart(userId);
        }
        return false;
    }
    return false;
}

export const createOrder: (cart: CartObject) => OrderEntity = (cart: CartObject) => {
    return saveOrder(cart.cart.userId, cart);
}