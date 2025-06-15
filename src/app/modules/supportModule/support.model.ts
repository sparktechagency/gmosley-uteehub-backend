// support.model.ts
import mongoose, { Schema } from 'mongoose';
import { ENUM_USER_ROLE } from '../../../enums/user';

const messageSchema = new Schema(
  {
    sender: {
      type: String,
      enum: [ENUM_USER_ROLE.CLIENT, ENUM_USER_ROLE.VENDOR, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const supportSchema = new Schema(
  {
    user: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, unique: true },
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      role: { type: String, required: true },
    },
    messages: [messageSchema],
    latestSubject: { type: String }, // Optional: To show in preview
    isDismissed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model('Support', supportSchema);
