import { Document, Types } from 'mongoose';

export interface IMessage extends Document {
    conversationId: Types.ObjectId;
    senderId: Types.ObjectId | null;
    text: string;
    attachment: string[];
    seenBy: {
        user: Types.ObjectId;
        seenAt: Date;
    }[];
    replyTo: Types.ObjectId;
}
