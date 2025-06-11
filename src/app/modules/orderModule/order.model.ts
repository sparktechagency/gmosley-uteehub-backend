import mongoose from "mongoose";
import { IOrder } from "./order.interface";

export const orderSchema = new mongoose.Schema<IOrder>(
    {
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'vendor',
        },
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'client',
        },
        deliverDate: {
            type: Date,
            default: Date.now,
        },
        extentionHistory: {
            type: [
                {
                    lastDate: Date,
                    newDate: Date,
                    reason: String,
                    status: {
                        type: String,
                        enum: ['pending', 'approved', 'rejected'],
                        default: 'pending',
                    },
                }
            ],
            default: [],
        },
        price: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: 'BDT'
        },
        quantity: {
            type: Number,
            default: 1
        },
        isCustom: {
            type: Boolean,
            default: false
        },
        designFiles: {
            type: [String],
            default: []
        },
        chatHistory: [
            {
                senderRole: {
                    type: String,
                    enum: ['client', 'vendor'],
                    default: 'client',
                },
                content: {
                    type: String,
                    default: '',
                },
                attachment: {
                    type: String,
                    default: '',
                },
                timestamps: {
                    type: Date,
                    default: Date.now,
                },
            }
        ],
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        deliveryOption: {
            type: String,
            enum: ['pickup', 'courier', 'pickupAndCourier'],
            default: 'pickup',
        },
        summery: {
            type: String,
            default: ''
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },
        shippingAddress: {
            type: String,
            default: ''
        },
    }, {
        timestamps: true,
    }
)

const Order = mongoose.model<IOrder>('order', orderSchema);
export default Order;
