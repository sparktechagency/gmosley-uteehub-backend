import mongoose from "mongoose";
import { Gender, IClient } from "./client.interface";

export const clientSchema = new mongoose.Schema<IClient>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            unique: true,
        },
        name: {
            type: String,
        },
        gender: {
            type: String,
            enum: Gender,
        },
        image: {
            type: String
        },
    },
    {
        timestamps: true,
    }
)

const Client = mongoose.model<IClient>('client', clientSchema)
export default Client
