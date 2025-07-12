import asyncHandler from '../../../shared/asyncHandler';
import generalOrderServices from './generalOrder.services';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import CustomError from '../../errors';
import Product from '../productModule/product.model';
import Stripe from 'stripe';
import config from '../../../config';
import walletServices from '../walletModule/wallet.services';
import notificationServices from '../notificationModule/notification.services';
import { CURRENCY_ENUM } from '../../../enums/currency';

const stripe = new Stripe(config.stripe_secret_key as string);

// controller for create new general order
const createGeneralOrder = asyncHandler(async (req: Request, res: Response) => {
  const orderData = req.body;
  if (orderData.paymentStatus !== 'paid') {
    throw new CustomError.BadRequestError('Payment is not completed!');
  }

  const wallet = await walletServices.getSpecificWalletByUserId(orderData.vendor);
  if (!wallet) {
    throw new CustomError.NotFoundError('Wallet not found for the vendor!');
  }

  // check the all product is available
  const products = await Product.find({ _id: { $in: orderData.products.map((product: any) => product.productId) } });
  if (products.length !== orderData.products.length) {
    throw new CustomError.BadRequestError('Some products are not available!');
  }

  // check the all product is available
  const isAvailable = products.every((product: any) => {
    const matchingInput = orderData.products.find(
      (p: any) => p.productId === product._id.toString()
    );
    if (!matchingInput) return false;
    return product.quantity >= matchingInput.quantity;
  });
  if (!isAvailable) {
    throw new CustomError.BadRequestError('Some products are not available!');
  }

  // check the total price is correct
  const totalPrice = products.reduce((total: number, product: any) => {
    const orderedProduct = orderData.products.find((p: any) => p.productId === product._id.toString());
    return total + product.price * orderedProduct.quantity;
  }, 0);

  if (totalPrice !== orderData.price) {
    throw new CustomError.BadRequestError('Total price is not correct!');
  }

  // check payment session
  const session: any = await stripe.checkout.sessions.retrieve(orderData.sessionId, {
    expand: ['payment_intent'],
  });
  if (!session.payment_intent) {
    throw new CustomError.BadRequestError('Payment intent not found!');
  }
  if (session.payment_status !== 'paid') {
    throw new CustomError.BadRequestError('Payment is not completed!');
  }

  orderData.currency = CURRENCY_ENUM.USD;
  orderData.tnxId = session.payment_intent.latest_charge;

  const generalOrder = await generalOrderServices.createGeneralOrder(orderData);

  // update product quantity
  await Promise.all(
    orderData.products.map(async (product: any) => {
      await Product.updateOne({ _id: product.productId }, { $inc: { quantity: -product.quantity } });
    }),
  );

  // update vendor wallet
  wallet.balance.amount += orderData.price;
  wallet.transactionHistory.push({
    amount: orderData.price,
    type: 'credit',
    transactionAt: new Date(),
  });
  await wallet.save();

  // create notification
  const notificationData = {
    consumer: orderData.vendor,
    content: {
      title: 'New Order',
      message: `You have received a new order`,
      source: {
        type: 'order',
        id: orderData._id,
      },
    },
  };
  await notificationServices.createNotification(notificationData);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'General order created successfully',
    data: generalOrder,
  });
});

const getAllGeneralOrders = asyncHandler(async (req: Request, res: Response) => {
  const generalOrders = await generalOrderServices.retrieveAllGeneralOrders(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'General orders retrieved successfully',
    data: generalOrders,
  });
});

const getSpecificGeneralOrder = asyncHandler(async (req: Request, res: Response) => {
  const generalOrder = await generalOrderServices.retrieveSpecificGeneralOrder(req.params.id);
  if (!generalOrder) {
    throw new CustomError.NotFoundError('General order not found!');
  }
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'General order retrieved successfully',
    data: generalOrder,
  });
});

const deleteGeneralOrder = asyncHandler(async (req: Request, res: Response) => {
  const generalOrder = await generalOrderServices.deleteGeneralOrder(req.params.id);
  if (!generalOrder?.$isDeleted) {
    throw new CustomError.NotFoundError('General order not found!');
  }
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'General order deleted successfully',
    data: generalOrder,
  });
});

export default {
  createGeneralOrder,
  getAllGeneralOrders,
  getSpecificGeneralOrder,
  deleteGeneralOrder,
};
