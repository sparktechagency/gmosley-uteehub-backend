import mongoose from 'mongoose';
import { IOrder } from './order.interface';
import { DELIVERY_OPTIONS, devliveryOptions } from './order.constants';

export const orderSchema = new mongoose.Schema<IOrder>(
  {
    orderId: {
      type: String,
      unique: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'vendor',
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'client',
    },
    deliveryDate: {
      type: Date,
      default: Date.now,
    },
    extentionHistory: {
      type: [
        {
          lastDate: Date,
          newDate: Date,
          reason: String,
          status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
          },
        },
      ],
      default: [],
      _id: false,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'BDT',
    },
    quantity: {
      type: Number,
      default: 1,
    },
    isCustom: {
      type: Boolean,
      default: false,
    },
    designFiles: {
      type: [String],
      default: [],
    },
    chatHistory: [
      {
        senderRole: {
          type: String,
          enum: ['client', 'vendor'],
          default: 'client',
        },
        content: {
          type: String,
          default: '',
        },
        attachment: {
          type: String,
          default: '',
        },
        timestamps: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ['offered', 'rejected', 'accepted', 'delivery-requested', 'delivery-confirmed', 'revision', 'cancelled'],
      default: 'offered',
    },
    deliveryOption: {
      type: String,
      enum: devliveryOptions,
      default: DELIVERY_OPTIONS.pickup,
    },
    summery: {
      type: String,
      default: '',
    },
    paymentStatus: {
      type: String,
      enum: ['due', 'hold', 'paid', 'failed'],
      default: 'due',
    },
    shippingAddress: {
      type: String,
      default: '',
    },
    sessionId: {
      type: String,
      default: '',
    },
    tnxId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model<IOrder>('order', orderSchema);
export default Order;
