import { Document, Types } from "mongoose";

export interface IReferralCode extends Document{
    code: string,
    user: Types.ObjectId
    _id: Types.ObjectId
}