import mongoose from 'mongoose';
import { IVendor } from './vendor.interface';

export const vendorSchema = new mongoose.Schema<IVendor>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      unique: true,
    },
    name: {
      type: String,
    },
    address: {
      type: String,
    },
    description: {
      type: String,
    },
    deliveryOption: [
      {
        type: String,
        enum: ['pickup', 'courier', 'pickupAndCourier'],
      },
    ],
    documents: {
      type: [String],
    },
    cords: {
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Vendor = mongoose.model<IVendor>('vendor', vendorSchema);
export default Vendor;
