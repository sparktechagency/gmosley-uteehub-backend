import { Document } from 'mongoose';

export interface IPrivacyPolicy extends Document {
  privacyPolicy: string;
}
