import mongoose from 'mongoose';
import { CartEntity } from '../schemas/cart.entity';
import { productSchema } from './product'

const cartSchema = new mongoose.Schema<CartEntity>(
    {
        id: {
            type: String,
            required: true,
            immutable: true,
            default: () => crypto.randomUUID()
        },
        userId: {
            type: String,
            required: true,
            immutable: true,
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        items: [{
            count: {
                type: Number,
                required: true,
                default: 0
            },
            product: productSchema
        }]
    }
);

export default mongoose.model<CartEntity>('Cart', cartSchema);