import { Document, Types } from 'mongoose';

export interface IConversation extends Document {
    members: Types.ObjectId[];
    unreadCounts: {
        userId: Types.ObjectId;
        count: number;
    }[];
    latestmessage: string;
}
