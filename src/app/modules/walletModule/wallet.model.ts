import mongoose from 'mongoose';
import { IWallet } from './wallet.interface';
import { CURRENCY_ENUM } from '../../../enums/currency';
import { ENUM_USER_ROLE } from '../../../enums/user';

const walletSchema = new mongoose.Schema<IWallet>(
  {
    user: {
      type: {
        type: String,
        default: ENUM_USER_ROLE.VENDOR,
      },
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    },
    balance: {
      amount: { type: Number, default: 0 },
      currency: { type: String, enum: CURRENCY_ENUM, default: CURRENCY_ENUM.USD },
    },
    transactionHistory: [
      {
        amount: { type: Number },
        type: { type: String, enum: ['credit', 'debit'] },
        transactionAt: { type: Date },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Wallet = mongoose.model<IWallet>('wallet', walletSchema);
export default Wallet;
