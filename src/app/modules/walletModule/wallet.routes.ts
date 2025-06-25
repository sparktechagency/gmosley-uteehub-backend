import express from 'express';
import walletControllers from './wallet.controllers';
import authorization from '../../middlewares/authorization';
import { ENUM_USER_ROLE } from '../../../enums/user';

const walletRouter = express.Router();

walletRouter.post('/withdraw', authorization(ENUM_USER_ROLE.VENDOR), walletControllers.withdrawMoneyFromWalletToVendorStripeAccount);
walletRouter.get('/retrieve/user/:userId', walletControllers.getSpecificWalletByUserId);

export default walletRouter;
