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
import conversationService from '../conversationModule/conversation.service';
import messageServices from '../messageModule/message.services';
import walletServices from '../walletModule/wallet.services';
import notificationServices from '../notificationModule/notification.services';
import { createNotification } from '../notificationModule/notification.utils';

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

  // create notification
  const notificationData = {
    consumer: order.client,
    content: {
      title: 'New Offer',
      message: `You have received a new offer`,
      source: {
        type: 'order',
        id: order._id,
      },
    },
  };
  await notificationServices.createNotification(notificationData);

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
  const updateData = req.body;
  const orderId = req.params.id;

  const existOrder = await orderServices.retrieveSpecificOrder(orderId);
  if (!existOrder) {
    throw new CustomError.NotFoundError('No order found!');
  }
  if (updateData.status === existOrder.status) {
    throw new CustomError.BadRequestError(`Order already ${existOrder.status}`);
  }

  const conversation = await conversationService.retriveConversationByMemberIds([
    existOrder.client?.toString(),
    existOrder.vendor?.toString(),
  ]);

  switch (updateData.status) {
    case 'accepted':
      if (existOrder.status !== 'offered') {
        throw new CustomError.BadRequestError('Only offered order can be accepted!');
      }

      const session: any = await stripe.checkout.sessions.retrieve(updateData.sessionId, {
        expand: ['payment_intent'],
      });
      if (!session.payment_intent) {
        throw new CustomError.BadRequestError('Payment intent not found!');
      }
      if (session.payment_status !== 'paid') {
        throw new CustomError.BadRequestError('Payment is not completed!');
      }

      updateData.paymentStatus = 'hold';
      updateData.tnxId = session.payment_intent.latest_charge;

      // create a message for accept the order
      if (conversation) {
        const messagePayload = {
          conversationId: conversation._id,
          senderId: existOrder.vendor,
          text: 'The order has been accepted.',
        };
        await messageServices.createMessage(messagePayload);
      }

      // create notification
      const notificationData = {
        consumer: existOrder.vendor,
        content: {
          title: 'Order Accepted',
          message: `Your order has been accepted by the client`,
          source: {
            type: 'order',
            id: existOrder._id,
          },
        },
      };
      await notificationServices.createNotification(notificationData);
      break;
    case 'delivery-requested':
      if (existOrder.status !== 'accepted' && existOrder.status !== 'revision') {
        throw new CustomError.BadRequestError('Only accepted or revision order can be delivery requested!');
      }

      if (conversation) {
        const messagePayload = {
          conversationId: conversation._id,
          senderId: existOrder.vendor,
          text: updateData.description,
          attachment: updateData.workSamples,
        };
        await messageServices.createMessage(messagePayload);
      }

      break;
    case 'delivery-confirmed':
      if (existOrder.status !== 'delivery-requested') {
        throw new CustomError.BadRequestError('Only delivery requested order can be delivery confirmed!');
      }

      const vendorWallet = await walletServices.getSpecificWalletByUserId(existOrder.vendor?.toString());
      if (!vendorWallet) {
        throw new CustomError.NotFoundError('Vendor wallet not found!');
      }

      // calculate the vendor amount. system fee 20%
      const systemFee = (existOrder.price * 20) / 100;
      const vendorAmount = existOrder.price - systemFee;

      // add vendor amount to vendor wallet
      vendorWallet.balance.amount += vendorAmount;
      vendorWallet.transactionHistory.push({
        amount: vendorAmount,
        type: 'credit',
        transactionAt: new Date(),
      });
      await vendorWallet.save();

      if (conversation) {
        const messagePayload = {
          conversationId: conversation._id,
          senderId: existOrder.client,
          text: 'Congrulations, The order has been delivery confirmed.',
        };
        await messageServices.createMessage(messagePayload);
      }
      updateData.status = 'delivery-confirmed';
      break;
    case 'revision':
      if (existOrder.status !== 'delivery-requested') {
        throw new CustomError.BadRequestError('Only delivery requested order can be revision!');
      }

      if (conversation) {
        const messagePayload = {
          conversationId: conversation._id,
          senderId: existOrder.client,
          text: 'The order has been revision.',
        };
        await messageServices.createMessage(messagePayload);
      }
      updateData.status = 'revision';
      await createNotification({
        consumer: existOrder.vendor,
        content: {
          title: 'Revision Requested',
          message: 'The client has requested a revision for this order.',
          source: {
            type: 'order',
            id: existOrder._id,
          },
        },
      });
      break;
    case 'cancelled':
      if (existOrder.status !== 'delivery-confirmed') {
        throw new CustomError.BadRequestError('Only delivery confirmed order can be cancelled!');
      }

      updateData.status = 'cancelled';
      await createNotification({
        consumer: existOrder.vendor,
        content: {
          title: 'Order Cancelled',
          message: 'The client has cancelled your order offer.',
          source: {
            type: 'order',
            id: existOrder._id,
          },
        },
      });
      break;
    case 'completed':
      if (existOrder.status !== 'delivery-confirmed') {
        throw new CustomError.BadRequestError('Only delivery confirmed order can be completed!');
      }
      updateData.status = 'completed';
      break;
    case 'rejected':
      if (existOrder.status !== 'offered') {
        throw new CustomError.BadRequestError('Only offered order can be rejected!');
      }
      updateData.status = 'rejected';
      await createNotification({
        consumer: existOrder.vendor,
        content: {
          title: 'Order Rejected',
          message: 'The client has rejected your order offer.',
          source: {
            type: 'order',
            id: existOrder._id,
          },
        },
      });
      break;
    default:
      throw new CustomError.BadRequestError('Invalid order status! Please provide a valid order status.');
      break;
  }

  const order = await orderServices.updateSpecificOrder(orderId, updateData);
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

  const conversation = await conversationService.retriveConversationByMemberIds([order.client?.toString(), order.vendor?.toString()]);

  // Optional: Prevent multiple pending requests
  const hasPendingRequest = order.extentionHistory.some((ext) => ext.status === 'pending');
  if (hasPendingRequest) {
    throw new CustomError.BadRequestError('There is already a pending deadline extension request.');
  }

  // check new date less then last date
  if (new Date(newDate) <= new Date(order.deliveryDate)) {
    throw new CustomError.BadRequestError('You already have the remaining deadline till ' + order.deliveryDate.toDateString());
  }

  const extensionRequest = {
    lastDate: order.deliveryDate,
    newDate,
    reason,
    status: 'pending',
  };

  order.extentionHistory.push(extensionRequest);
  await order.save();

  if (conversation) {
    const messagePayload = {
      conversationId: conversation._id,
      senderId: order.client,
      text: `The order deadline has been extend request from Date ${order.deliveryDate.toDateString()} to ${new Date(newDate).toDateString()}`,
    };
    await messageServices.createMessage(messagePayload);
  }

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

  const conversation = await conversationService.retriveConversationByMemberIds([order.client?.toString(), order.vendor?.toString()]);

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

  if (order.status === 'revision') {
    order.status = 'accepted';
  }

  await order.save();

  if (conversation) {
    const messagePayload = {
      conversationId: conversation._id,
      senderId: order.client,
      text: `The order deadline has been ${status} from Date ${order.deliveryDate.toDateString()} to ${new Date(pendingRequest.newDate).toDateString()}`,
    };
    await messageServices.createMessage(messagePayload);
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: `Deadline extension request ${status} successfully.`,
  });
});

const initiateOrderPayment = asyncHandler(async (req: Request, res: Response) => {
  const { customerEmail, amount, currency, quantity = 1 } = req.body;

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
