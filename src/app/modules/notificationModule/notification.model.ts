import mongoose from 'mongoose';
import { INotification } from './notification.interface';

const notificationSchema = new mongoose.Schema<INotification>(
    {
        consumer: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
        content: {
            title: { type: String, required: true },
            message: { type: String, required: true },
            source: {
                type: { type: String, required: true },
                id: { type: mongoose.Schema.Types.ObjectId, refPath: 'source.type' },
            },
        },
        isDismissed: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

const Notification = mongoose.model<INotification>('notification', notificationSchema);
export default Notification;
