// import mongoose from 'mongoose';
// import { IVendor } from './vendor.interface';

import mongoose from 'mongoose';
import { IVendor } from './vendor.interface';
import { devliveryOptions } from '../orderModule/order.constants';

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
        enum: devliveryOptions,
      },
    ],
    documents: {
      type: [String],
    },
    // cords: {
    //   lat: Number,
    //   lng: Number,
    // },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
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

// Add this index for geospatial querying
vendorSchema.index({ location: '2dsphere' });

const Vendor = mongoose.model<IVendor>('vendor', vendorSchema);
export default Vendor;
