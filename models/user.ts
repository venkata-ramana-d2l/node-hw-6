import mongoose from 'mongoose';
import crypto from 'crypto';
import { UserEntity } from '../schemas/user.entity';

const userSchema = new mongoose.Schema<UserEntity>(
    {
        id: {
            type: String,
            required: true,
            immutable: true,
            default: () => crypto.randomUUID()
        }
    }
);

export default mongoose.model<UserEntity>('User', userSchema);

