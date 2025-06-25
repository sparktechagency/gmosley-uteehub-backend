import { Document, Types } from 'mongoose';

export interface IWallet extends Document {
  user: {
    type: string;
    id: Types.ObjectId;
  };
  balance: {
    amount: number;
    currency: string;
  };
  transactionHistory: {
    amount: number;
    type: string;
    transactionAt: Date;
  }[];
  lastWithdrawal: Date | null;
}
