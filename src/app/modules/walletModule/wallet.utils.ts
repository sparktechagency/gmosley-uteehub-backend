import { IWallet } from './wallet.interface';
import walletServices from './wallet.services';

// function for create and update specific wallet by userId
const createOrUpdateSpecificWallet = async (userId: string, data: Partial<IWallet>) => {
    return await walletServices.createOrUpdateSpecificWallet(userId, data);
};

export default {
    createOrUpdateSpecificWallet,
};
