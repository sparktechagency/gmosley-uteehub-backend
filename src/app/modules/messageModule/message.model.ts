import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'conversation',
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    text: {
      type: String,
    },
    attachment: [{
      type: String,
    }],
    seenBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user',
        },
        seenAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: 'message',
    },
  },
  {
    timestamps: true,
  },
);

// Custom validator to ensure either text or attachment is present
MessageSchema.pre('validate', function (next) {
  if (!this.text && !this.attachment) {
    next(new Error('Either text or attachment is required.'));
  } else {
    next();
  }
});

const Message = mongoose.model('message', MessageSchema);
export default Message;
