import { Document, Types } from 'mongoose';

enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  status: string;
  isEmailVerified: boolean;
  verification?: {
    code: string;
    expireDate: Date;
  };
  role: string;
  isSocial?: boolean;
  fcmToken?: string;
  survey: Types.ObjectId;
  gender: Gender;
  referralCode?: string;
  point?: number;

  // method declarations
  comparePassword(userPlanePassword: string): boolean
  compareVerificationCode(userPlaneCode: string): boolean;
}

export default IUser;
