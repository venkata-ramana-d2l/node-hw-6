import { CartEntity, CartItemEntity } from "../../schemas/cart.entity";
import { OrderEntity } from "../../schemas/order.entity";
import { getCart, setCart, createEmptyCart, emptyCart, addProductToCart, removeProductFromCart, saveOrder } from "./cart.repository";

export type CartObject = { cart: CartEntity, total: number };

const calculateTotal: (items: CartItemEntity[]) => number = (items: CartItemEntity[]) => {
    let total = 0;
    items.forEach(item => total+= item.product.price * item.count);
    return total;
}

export const getUserCart: (userId: string) => any = async (userId: string) => {
    const cart  = await getCart(userId);
    if (cart && !cart.isDeleted) {
        const total = calculateTotal(cart.items);
        return {
            cart,
            total
        }
    }
    return false;
};

export const createNewCart: (userId: string) => any = async (userId: string) => {
    const emptyCart = await createEmptyCart(userId);
    return {
        cart: { ...emptyCart },
        total: 0
    }
}

export const deleteCart: (userId: string) => any = async (userId: string) => {
    await emptyCart(userId);
}

export const dropProduct: (userId: string, productId: string) => any = async (userId: string, productId: string) => {
    return await removeProductFromCart(userId, productId);
}

export const addProduct: (userId: string, productDetails: any) => any = async (userId: string, productDetails: any) => {
    return await addProductToCart(userId, productDetails);
    // return getUserCart(userId);
}

export const updateProductCount: (userId: string, productId: string, count: number) => any = async (userId: string, productId: string, count: number ) => {
    const userCartObject = await getUserCart(userId);
    if (userCartObject) {
        const userCart = (userCartObject as CartObject).cart;
        const itemIndex = userCart.items.findIndex(item => item.product.id === productId);
        if (itemIndex > -1) {
            userCart.items[itemIndex].count = count;
            return await setCart(userId, userCart);
        }
        return false;
    }
    return false;
}

export const createOrder: (cart: CartObject) => any = async (cart: CartObject) => {
    return await saveOrder(cart.cart.userId, cart);
}