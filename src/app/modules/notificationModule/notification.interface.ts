import { Document, Types } from 'mongoose';

export interface INotification extends Document {
    consumer: Types.ObjectId;
    content: {
        title: string;
        message: string;
        source: {
            type: string;
            id: Types.ObjectId;
        };
    };
    isDismissed: boolean;
    createdAt: Date;
    updatedAt: Date;
}
