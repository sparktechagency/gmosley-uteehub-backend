import { Document } from "mongoose";

export interface IContactUs extends Document{
    email: string,
    createdAt: Date,
    updatedAt: Date
}