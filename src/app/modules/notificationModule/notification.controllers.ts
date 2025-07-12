import { Request, Response } from 'express';
import asyncHandler from '../../../shared/asyncHandler';
import notificationServices from './notification.services';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import notFound from '../../middlewares/notFound';

// controller for retrive all notifications by consumer id
const getAllNotificationsByConsumerId = asyncHandler(async (req: Request, res: Response) => {
    const { consumerId } = req.params;

    const notifications = await notificationServices.getAllNotification(consumerId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        status: 'success',
        message: 'Notifications retrive successfull',
        data: notifications,
    });
});

// controller for dismissed specific notification by id
const dismissSpecificNotification = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const notification = await notificationServices.dismissNotification(id);
    if (!notification.modifiedCount) {
        throw new Error('Failed to dismiss notification!');
    }
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        status: 'success',
        message: 'Notification dismissed successfull',
    });
});

// controller for delete all notifications by consumer id
const deleteAllNotificationsByConsumerId = asyncHandler(async (req: Request, res: Response) => {
    const { consumerId } = req.params;
    const notification = await notificationServices.deleteAllNotifications(consumerId);
    if (!notification.deletedCount) {
        throw new Error('Failed to delete notifications!');
    }
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        status: 'success',
        message: 'Notifications deleted successfull',
    });
});

export default {
    getAllNotificationsByConsumerId,
    dismissSpecificNotification,
    deleteAllNotificationsByConsumerId,
};
