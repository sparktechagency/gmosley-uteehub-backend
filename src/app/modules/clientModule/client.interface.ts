import { Document, Types } from "mongoose";

export enum Gender {
    Male = 'male',
    Female = 'female',
    Other = 'other',
  }

export interface IClient extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    name : string;
    gender: Gender;
    image: string;
    createdAt: Date;
    updatedAt: Date;
}