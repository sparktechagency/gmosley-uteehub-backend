import { Document } from 'mongoose';

export interface ITermsCondition extends Document {
  termsCondition: string;
}
