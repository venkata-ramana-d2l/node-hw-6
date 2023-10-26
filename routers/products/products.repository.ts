import Product from '../../models/product'

export const getProducts: () => any = async () => {
    return await Product.find().exec();
}

export const getProduct: (productId: string) => any = async (productId: string) => {
    console.log(await Product.findOne({id: productId}));
    return await Product.findOne({id: productId}).exec();
}