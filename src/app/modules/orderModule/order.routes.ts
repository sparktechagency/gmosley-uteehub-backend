import express from 'express';
import orderController from './order.controllers';

const orderRouter = express.Router();

orderRouter.post('/create', orderController.createOrder);

export default orderRouter;