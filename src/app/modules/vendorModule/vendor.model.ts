import mongoose from 'mongoose';
import { IVendor } from './vendor.interface';

export const vendorSchema = new mongoose.Schema<IVendor>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    services: {
      type: [String],
      required: true,
    },
    deliveryOption: [
      {
        type: String,
        enum: ['pickup', 'courier'],
        required: true,
      },
    ],
    documents: {
      type: [String],
      required: true,
    },
    radius: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Vendor = mongoose.model<IVendor>('vendor', vendorSchema);
export default Vendor;
