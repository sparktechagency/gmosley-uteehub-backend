import { Document, Types } from 'mongoose';

export interface ITeam extends Document {
  name: string; 
  description: string; 
  image: string; 
  email: string; 
  position: string; 
  createdAt: Date;
  updatedAt: Date;
  _id: Types.ObjectId;
}