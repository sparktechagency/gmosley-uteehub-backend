import { Document, Types } from "mongoose";

export interface IVendor extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    name: string;
    address: string;
    services: string[];
    deliveryOption: string[];
    documents: string[];
    radius: number;
    rating: number;
    image: string;
    createdAt: Date;
    updatedAt: Date;
}
