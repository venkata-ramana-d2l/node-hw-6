import products from '../../data/products';
import { ProductEntity } from '../../schemas/product.entity';

export const getProducts: () => ProductEntity[] = () => {
    return products;
}

export const getProduct: (productId: string) => ProductEntity | undefined = (productId: string) => {
    return products.find(pro => pro.id === productId);

}