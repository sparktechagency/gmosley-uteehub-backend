import { Types } from 'mongoose';
import { IWallet } from './wallet.interface';
import Wallet from './wallet.model';
import CustomError from '../../errors';

// service for create or update new wallet by user id
const createOrUpdateSpecificWallet = async (userId: string, data: Partial<IWallet>) => {
    return await Wallet.findOneAndUpdate(
        { 'user.id': userId },
        data,
        { runValidators: true, upsert: true, new: true }, // Add upsert: true
    );
};

// service for get specific wallet by user
const getSpecificWalletByUserId = async (userId: string) => {
    return await Wallet.findOne({ 'user.id': userId }).select('balance transactionHistory updatedAt');
};

// service for update wallet by id
const updateWalletById = async (userId: string, data: Partial<IWallet>) => {
    return await Wallet.findOneAndUpdate({ 'user.id': userId }, data, { runValidators: true });
};

export default {
    createOrUpdateSpecificWallet,
    getSpecificWalletByUserId,
    updateWalletById,
};
