import { INotification } from './notification.interface';
import Notification from './notification.model';

// service for create new notification
const createNotification = async (data: Partial<INotification>) => {
    return await Notification.create(data);
};

// service for get all notifications by consumer id
const getAllNotification = async (consumerId: string) => {
    return await Notification.find({ consumer: consumerId }).sort({ createdAt: -1 });
};

// service for dismissed notification
const dismissNotification = async (notificationId: string) => {
    return await Notification.updateOne({ _id: notificationId }, { isDismissed: true });
};

//service for delete all notifications by consumer id
const deleteAllNotifications = async (consumerId: string) => {
    console.log(consumerId);
    return await Notification.deleteMany({ consumer: consumerId });
};

export default {
    createNotification,
    getAllNotification,
    dismissNotification,
    deleteAllNotifications,
};
