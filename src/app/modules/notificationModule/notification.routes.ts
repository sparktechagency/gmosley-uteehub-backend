import express from 'express';
import notificationControllers from './notification.controllers';

const notificationRouter = express.Router();

notificationRouter.get('/retrive/consumer/:consumerId', notificationControllers.getAllNotificationsByConsumerId);
notificationRouter.patch('/dismiss/:id', notificationControllers.dismissSpecificNotification);
notificationRouter.delete('/clear/consumer/:consumerId', notificationControllers.deleteAllNotificationsByConsumerId);

export default notificationRouter;
