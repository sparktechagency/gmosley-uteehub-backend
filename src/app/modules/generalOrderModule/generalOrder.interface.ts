import { Document, Types } from "mongoose";

export interface IGeneralOrder extends Document {
    orderId: string;
    vendor: Types.ObjectId;
    client: Types.ObjectId;
    price: number;
    currency: string;
    products: {
        productId: Types.ObjectId;
        quantity: number;
    }[];
    status: string;
    paymentStatus: string;
    shippingAddress: string;
    sessionId: string;
    tnxId: string;
}