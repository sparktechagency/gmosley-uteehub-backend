import { Request, Response } from 'express';
import asyncHandler from '../../../shared/asyncHandler';
import IdGenerator from '../../../utils/IdGenerator';
import orderServices from './order.services';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import fileUploader from '../../../utils/fileUploader';
import CustomError from '../../errors';
import Stripe from 'stripe';
import config from '../../../config';

const stripe = new Stripe(config.stripe_secret_key as string);

// controller for create new order
const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const orderData = req.body;
  const files = req.files;

  const lastOrder = await orderServices.getLastOrder();
  const lastOrderId = lastOrder ? parseInt(lastOrder.orderId.split('-')[1]) : 0;
  const orderId = IdGenerator.generateSerialId('ORD', lastOrderId, 5);
  orderData.orderId = orderId;

  // upload design files
  if (files && files.designFiles) {
    const designFiles = await fileUploader(files, `${orderId}-design-files`, 'designFiles');
    orderData.designFiles = designFiles;
  }

  const order = await orderServices.createOrder(orderData);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'Order created successfully',
    data: order,
  });
});

// controller for get all order
const getAllOrder = asyncHandler(async (req: Request, res: Response) => {
  const orders = await orderServices.retrieveAllOrders(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Order retrieved successfully',
    data: orders,
  });
});

// controller for get specific order
const getSpecificOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderServices.retrieveSpecificOrder(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Order retrieved successfully',
    data: order,
  });
});

// controller for update specific order
const updateSpecificOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderServices.updateSpecificOrder(req.params.id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Order updated successfully',
  });
});

// order deadline extend request
const extendOrderDeadline = asyncHandler(async (req: Request, res: Response) => {
  const { newDate, reason } = req.body;
  const orderId = req.params.id;

  const order = await orderServices.retrieveSpecificOrder(orderId);
  if (!order) {
    throw new CustomError.NotFoundError('No order found!');
  }

  // Optional: Prevent multiple pending requests
  const hasPendingRequest = order.extentionHistory.some((ext) => ext.status === 'pending');
  if (hasPendingRequest) {
    throw new CustomError.BadRequestError('There is already a pending deadline extension request.');
  }

  const extensionRequest = {
    lastDate: order.deliveryDate,
    newDate,
    reason,
    status: 'pending',
  };

  order.extentionHistory.push(extensionRequest);
  await order.save();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Deadline extension request submitted successfully.',
  });
});

// controller for approve or reject deadline extend request
const approveOrRejectDeadlineExtendRequest = asyncHandler(async (req: Request, res: Response) => {
  const { status, newDate } = req.body;
  const orderId = req.params.id;

  const order = await orderServices.retrieveSpecificOrder(orderId);
  if (!order) {
    throw new CustomError.NotFoundError('No order found!');
  }

  const pendingRequestIndex = order.extentionHistory.findIndex((ext) => ext.status === 'pending');

  if (pendingRequestIndex === -1) {
    throw new CustomError.BadRequestError('No pending deadline extension request found.');
  }

  const pendingRequest = order.extentionHistory[pendingRequestIndex];

  if (status === 'approved') {
    // Update delivery date
    order.deliveryDate = pendingRequest.newDate;
    order.extentionHistory[pendingRequestIndex].status = 'approved';
  } else if (status === 'rejected') {
    order.extentionHistory[pendingRequestIndex].status = 'rejected';
  } else {
    throw new CustomError.BadRequestError('Invalid status value.');
  }

  await order.save();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: `Deadline extension request ${status} successfully.`,
  });
});

const initiateOrderPayment = asyncHandler(async (req: Request, res: Response) => {
  const { customerEmail, amount, currency, quantity } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price_data: { currency, product_data: { name: 'Order' }, unit_amount: amount * 100 }, quantity }],
    mode: 'payment',
    customer_email: customerEmail,
    success_url: `${config.server_url}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.server_url}/cancel`,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Order created successfully',
    data: { url: session.url },
  });
});

export default {
  createOrder,
  getAllOrder,
  getSpecificOrder,
  updateSpecificOrder,
  extendOrderDeadline,
  approveOrRejectDeadlineExtendRequest,
  initiateOrderPayment,
};
