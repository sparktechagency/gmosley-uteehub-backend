import express from 'express';
import authorization from '../../middlewares/authorization';
import messageControllers from './message.controllers';
import { ENUM_USER_ROLE } from '../../../enums/user';

const messageRouter = express.Router();
messageRouter.use(authorization(ENUM_USER_ROLE.CLIENT, ENUM_USER_ROLE.VENDOR));

// messageRouter.post('/send', messageControllers.sendMessage);
messageRouter.get('/retrive/:conversationId', messageControllers.retrieveAllMessageByConversationId);

export default messageRouter;
