import { Document, Types } from "mongoose";

export interface IVendor extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    name: string;
    address: string;
    description: string;
    deliveryOption: string[];
    documents: string[];
    location: {
        type: string;
        coordinates: number[];
    };
    rating: number;
    image: string;
    createdAt: Date;
    updatedAt: Date;
}
