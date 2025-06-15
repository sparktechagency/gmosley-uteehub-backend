import express from 'express';
import orderController from './order.controllers';

const orderRouter = express.Router();

orderRouter.post('/create', orderController.createOrder);
orderRouter.get('/retrieve/all', orderController.getAllOrder);
orderRouter.get('/retrieve/specific/:id', orderController.getSpecificOrder);
orderRouter.patch('/update/:id', orderController.updateSpecificOrder);
orderRouter.patch('/deadline-extend/request/:id', orderController.extendOrderDeadline);
orderRouter.patch('/deadline-extend/action/:id', orderController.approveOrRejectDeadlineExtendRequest);

export default orderRouter;
