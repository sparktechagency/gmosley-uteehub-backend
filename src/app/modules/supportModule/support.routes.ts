import express from 'express';
import supportController from './support.controller';
import authentication from '../../middlewares/authorization';
import { ENUM_USER_ROLE } from '../../../enums/user';

const supportRouter = express.Router();
supportRouter.post('/send-by-user', supportController.userCreateSupport);
supportRouter.post('/reply-by-admin', authentication(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), supportController.adminReplySupport);
supportRouter.get('/retrieve/all', supportController.getAllSupport);
supportRouter.post('/compose-email', supportController.composeEmail);
supportRouter.get('/retrieve/:id', supportController.getSupportById);
supportRouter.delete('/delete/:id', supportController.deleteSupportById);
// supportRouter.delete('/delete/bulk', supportController.deleteAllSupports);

export default supportRouter;
