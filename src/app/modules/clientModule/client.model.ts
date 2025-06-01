import mongoose from "mongoose";
import { IClient } from "./client.interface";

export const clientSchema = new mongoose.Schema<IClient>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

const Client = mongoose.model<IClient>('client', clientSchema)
export default Client
