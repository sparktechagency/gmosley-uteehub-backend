import { Document, Types } from "mongoose";

export interface IProduct extends Document {
    creator: Types.ObjectId;
    name: string;
    category: Types.ObjectId;
    isFeatured: boolean;
    price: number;
    currency: string;
    quantity: number;
    size: string[];
    images: string[];
    colors: string[];
    createdAt: Date;
    updatedAt: Date;
}