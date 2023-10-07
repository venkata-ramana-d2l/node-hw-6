import { ProductEntity } from '../../schemas/product.entity';
import { getProduct, getProducts } from '../products/products.repository';

export const getAllProducts = () => {
    return getProducts();
}

export const getSingleProduct: (id: string) => ProductEntity | undefined = (id: string) => {
    return getProduct(id);
}