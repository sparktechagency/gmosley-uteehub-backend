import mongoose from 'mongoose';
import { IAttachment } from './attachment.interface';

const attachmentSchema = new mongoose.Schema<IAttachment>(
    {
        conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'conversation' },
        message: { type: mongoose.Schema.Types.ObjectId, ref: 'message' },
        content: [String],
    },
    {
        timestamps: true,
    },
);

const Attachment = mongoose.model<IAttachment>('attachment', attachmentSchema);
export default Attachment;
