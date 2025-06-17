import { Document, Types } from 'mongoose';

export interface IAttachment extends Document {
    _id: Types.ObjectId;
    conversation: Types.ObjectId;
    message: Types.ObjectId;
    type: string;
    content: string[];
}
