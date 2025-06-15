// support.interface.ts
import { Document, Types } from 'mongoose';
import { ENUM_USER_ROLE } from '../../../enums/user';

export interface ISupportMessage {
  sender: ENUM_USER_ROLE.CLIENT | ENUM_USER_ROLE.VENDOR | ENUM_USER_ROLE.ADMIN | ENUM_USER_ROLE.SUPER_ADMIN;
  message: string;
  sentAt?: Date;
}

export interface ISupportUser {
  id: Types.ObjectId;
  fullName: string;
  email: string;
  role: ENUM_USER_ROLE;
}

export interface ISupport extends Document {
  user: ISupportUser;
  latestSubject?: string;
  messages: ISupportMessage[];
  createdAt: Date;
  updatedAt: Date;
}
