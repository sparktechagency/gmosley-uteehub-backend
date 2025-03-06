import { Document, Types } from 'mongoose';

export interface IBlog extends Document {
  category: Types.ObjectId;
  title: string;
  description: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}
