import { INotification } from './notification.interface';
import notificationServices from './notification.services';

// function for create notification
const createNotification = async (data: Partial<INotification>) => {
    return await notificationServices.createNotification(data);
};

export default {
    createNotification,
};
