import mongoose from 'mongoose';
import { OrderEntity } from '../schemas/order.entity';
import Product from './product'

const paymentSchema = new mongoose.Schema(
    {
        
        'type': {
            type: String,
            required: true
        },
        address: String,
        creditCard: String
    }
);

const deliverySchema = new mongoose.Schema(
    {
            type: {
                type: String,
                required: true
            },
            address: {
                type: String,
                required: true
            }
        }
);

const orderSchema = new mongoose.Schema<OrderEntity>(
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
        cartId: {
            type: String,
            required: true,
            immutable: true,
        },
        payment: paymentSchema,
        delivery: deliverySchema,
        comments: String,
        status: String,
        total: {
            type: Number,
            required: true
        },
        items: [{
            count: {
                type: Number,
                required: true,
                default: 0
            },
            product: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: Product
            }
        }],

    }
);

export default mongoose.model<OrderEntity>('Order', orderSchema);