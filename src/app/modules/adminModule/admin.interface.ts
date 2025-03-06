import { Document } from 'mongoose';

interface IAdmin extends Document {
  fullName: string;
  email: string;
  password: string;
  status: string;
  isEmailVerified: boolean;
  verification?: {
    code: string;
    expireDate: Date;
  };
  role: string;

  // methods
  comparePassword(adminPlanePassword: string): boolean;
  compareVerificationCode(adminPlaneCode: string): boolean;
}

export default IAdmin;
