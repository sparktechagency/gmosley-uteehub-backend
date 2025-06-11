import { Document, Types } from "mongoose";

export interface IOrder extends Document {
    _id: Types.ObjectId;
    vendor: Types.ObjectId;
    client: Types.ObjectId;
    deliverDate: Date;
    extentionHistory: {
        lastDate: Date;
        newDate: Date;
        reason: string;
        status: string;
    }[];
    price: number;
    currency: string;
    quantity: number;
    isCustom: boolean;
    designFiles: string[];
    chatHistory: {
        senderRole: string;
        content: string;
        attachment: string;
        timestamps: Date
    }
    status: string;
    deliveryOption: string;
    summery: string;
    paymentStatus: string;
    shippingAddress: string
    createdAt: Date;
    updatedAt: Date;
}
