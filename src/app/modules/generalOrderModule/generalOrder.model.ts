import mongoose from 'mongoose';
import { IGeneralOrder } from './generalOrder.interface';

const generalOrderSchema = new mongoose.Schema<IGeneralOrder>(
    {
        orderId: String,
        vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        client: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        price: Number,
        currency: String,
        products: [{
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
            quantity: Number,
        }],
        status: {
            type: String,
            enum: ['pending', 'process', 'deliverd', 'cancelled'],
            default: 'pending',
        },
        paymentStatus: {
            type: String,
            enum: ['paid', 'unpaid', 'failed'],
            default: 'unpaid',
        },
        shippingAddress: String,
        sessionId: String,
        tnxId: String,
    },
    {
        timestamps: true,
    }
)

const GeneralOrder = mongoose.model<IGeneralOrder>('generalOrder', generalOrderSchema)
export default GeneralOrder
