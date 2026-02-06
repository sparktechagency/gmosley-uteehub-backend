import { Document, Types } from 'mongoose';
import { TDeliveryOption } from '../orderModule/order.interface';

export interface IVendor extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  address: string;
  description: string;
  deliveryOption: TDeliveryOption;
  documents: string[];
  location: {
    type: string;
    coordinates: number[];
  };
  rating: number;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}
