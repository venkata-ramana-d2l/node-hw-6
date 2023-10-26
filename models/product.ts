import mongoose from 'mongoose';
import { ProductEntity } from '../schemas/product.entity';

export const productSchema = new mongoose.Schema<ProductEntity>({
    id: {
        type: String,
        required: true,
        immutable: true,
        default: () => crypto.randomUUID()
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

export default mongoose.model<ProductEntity>('Product', productSchema);