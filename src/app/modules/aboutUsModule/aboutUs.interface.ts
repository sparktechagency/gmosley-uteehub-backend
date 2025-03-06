import { Document } from 'mongoose';

export interface IAboutUs extends Document {
  description: string;
}
