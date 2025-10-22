import { Request, Response } from 'express';
import asyncHandler from '../../../shared/asyncHandler';
import walletServices from './wallet.services';
import CustomError from '../../errors';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import config from '../../../config';
import stripe from 'stripe';
import { CURRENCY_ENUM } from '../../../enums/currency';
import sendMail from '../../../utils/sendEmail';
import userServices from '../userModule/user.services';

const stripeClient = new stripe(config.stripe_secret_key as string);

// controller for retrive specific wallet by user id
const getSpecificWalletByUserId = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const wallet = await walletServices.getSpecificWalletByUserId(userId);
  wallet?.transactionHistory.sort((a, b) => new Date(b.transactionAt).getTime() - new Date(a.transactionAt).getTime());
  if (!wallet) {
    throw new CustomError.NotFoundError('Wallet not found!');
  }
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Wallet retrieved successfully',
    data: wallet,
  });
});

// controller for withdraw money from wallet to vendor stripe account
const withdrawMoneyFromWalletToVendorStripeAccount = asyncHandler(async (req: Request, res: Response) => {
  const vendorId = req.user?.id;
  const { amount, currency } = req.body;

  if (!amount || !currency) {
    throw new CustomError.BadRequestError('Amount and currency are required!');
  }

  if (amount < Number(config.withdrawal_min_amount)) {
    throw new CustomError.BadRequestError(`Amount must be at least ${config.withdrawal_min_amount}!`);
  }

  const wallet = await walletServices.getSpecificWalletByUserId(vendorId);
  if (!wallet) {
    throw new CustomError.NotFoundError('Wallet not found!');
  }

  const cooldownInHours = Number(config.withdrawal_cooldown_hours);
  const now = new Date();

  if (wallet?.lastWithdrawal) {
    const last = new Date(wallet.lastWithdrawal);
    const hoursSinceLast = (now.getTime() - last.getTime()) / (1000 * 60 * 60);

    if (hoursSinceLast < cooldownInHours) {
      const waitHours = Math.ceil(cooldownInHours - hoursSinceLast);
      throw new CustomError.BadRequestError(`You can withdraw again in ${waitHours} hour(s).`);
    }
  }

  const vendor = await userServices.getSpecificUser(vendorId);
  // console.log(vendor)
  if (!vendor || !vendor.stripeAccountId) {
    throw new CustomError.BadRequestError('Vendor Stripe account not found!');
  }

  if (wallet.balance.amount < amount) {
    throw new CustomError.BadRequestError('Insufficient balance!');
  }

  // from the last wallet transaction after 9 days vendor can't withdraw
  const lastTransaction = wallet.transactionHistory[wallet.transactionHistory.length - 1];
  const lastTransactionDate = new Date(lastTransaction.transactionAt);
  const nowDate = new Date();
  const diffInDays = Math.floor((nowDate.getTime() - lastTransactionDate.getTime()) / (1000 * 60 * 60 * 24));
  if (diffInDays < 9) {
    throw new CustomError.BadRequestError('You will be able to withdraw after 9 days from the last transaction.');
  }

  const stripeAmount = Math.round(amount * 100);
  const normalizedCurrency = currency.toLowerCase();

  const supportedCurrencies = ['usd']; // Extend this if needed
  if (!supportedCurrencies.includes(normalizedCurrency)) {
    throw new CustomError.BadRequestError('Unsupported currency!');
  }

  const transfer = await stripeClient.transfers.create({
    amount: stripeAmount,
    currency: normalizedCurrency,
    destination: vendor.stripeAccountId,
    transfer_group: `WITHDRAWAL_${vendor._id}`,
  });

  if (!transfer) {
    throw new CustomError.BadRequestError('Transfer failed!');
  }

  // Update wallet
  wallet.balance.amount -= amount;
  wallet.lastWithdrawal = new Date();
  wallet.transactionHistory.push({
    amount,
    type: 'debit',
    transactionAt: new Date(),
  });

  await wallet.save();

  // Send email
  const content = `Your money has been withdrawn from your U-Tee-Hub wallet to your Stripe account.\nAmount: ${amount} ${currency.toUpperCase()}`;
  const mailOptions = {
    from: config.gmail_app_user as string,
    to: vendor.email,
    subject: 'U-Tee-Hub - Money Withdrawal',
    text: content,
  };
  sendMail(mailOptions);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Money withdrawn successfully',
    data: wallet,
  });
});

const regenerateOnboardingLink = asyncHandler(async (req: Request, res: Response) => {
  const email = req.params.email; // assuming user is authenticated
  const user = await userServices.getSpecificUserByEmail(email);
  // console.log(user)

  if (!user || !user.stripeAccountId) {
    throw new CustomError.BadRequestError('Vendor Stripe account not found!');
  }

  // Generate new onboarding link
  const accountLink = await stripeClient.accountLinks.create({
    account: user.stripeAccountId,
    refresh_url: 'https://your-backend.com/api/vendor/onboarding/refresh',  // deep link for your app
    return_url: 'https://your-backend.com/api/vendor/onboarding/complete',  // deep link for your app
    type: 'account_onboarding',
  });

  user.stripeOnboardingLink = accountLink.url;
  await user.save();

  // send email
  const content = `Your Stripe onboarding link has been regenerated.\nLink: ${accountLink.url}`;
  const mailOptions = {
    from: config.gmail_app_user as string,
    to: user.email,
    subject: 'U-Tee-Hub - Stripe Onboarding Link',
    text: content,
  };
  sendMail(mailOptions);

  return sendResponse(res, {
    statusCode: 200,
    status: 'success',
    message: 'Stripe onboarding link email sended successfully.',
    // data: { onboardingLink: accountLink.url },
  });
});

export default {
  getSpecificWalletByUserId,
  withdrawMoneyFromWalletToVendorStripeAccount,
  regenerateOnboardingLink,
};
