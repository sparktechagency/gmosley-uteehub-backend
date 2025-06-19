import { Document, Types } from 'mongoose';

interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  phone: string;
  password: string;
  status: string;
  isEmailVerified: boolean;
  verification?: {
    code: string;
    expireDate: Date;
  };
  isDeleted: boolean;
  isSocial?: boolean;
  fcmToken?: string;
  profile: {
    role: string;
    id: Types.ObjectId
  }
  isOnline: boolean;
  lastSeen: Date;

  // method declarations
  comparePassword(userPlanePassword: string): boolean
  compareVerificationCode(userPlaneCode: string): boolean;
}

export default IUser;
