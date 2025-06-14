import { Request, Response } from 'express';
import asyncHandler from '../../../shared/asyncHandler';
import IdGenerator from '../../../utils/IdGenerator';
import orderServices from './order.services';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

// controller for create new order
const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const orderData = req.body;

  const lastOrder = await orderServices.getLastOrder();
  const lastOrderId = lastOrder ? parseInt(lastOrder.orderId.split('-')[1]) : 0;
  const orderId = IdGenerator.generateSerialId('ORD', lastOrderId, 5);
  orderData.orderId = orderId;

  const order = await orderServices.createOrder(orderData);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'Order created successfully',
    data: order,
  });
});


export default {
    createOrder,
}