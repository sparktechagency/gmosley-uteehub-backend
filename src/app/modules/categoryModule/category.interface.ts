import { Document, Types } from 'mongoose';

export interface ICategory extends Document {
  creator: Types.ObjectId;
  name: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}
