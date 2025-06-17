import express from 'express';
import conversationControllers from './conversation.controllers';
import authorization from '../../middlewares/authorization';
import { ENUM_USER_ROLE } from '../../../enums/user';

const conversationRouter = express.Router();
conversationRouter.use(authorization(ENUM_USER_ROLE.CLIENT, ENUM_USER_ROLE.VENDOR));

conversationRouter.post('/create', conversationControllers.createConversation);
conversationRouter.get('/retrieve/specific/:id', conversationControllers.getConversationById);
conversationRouter.get('/retrieve/list/:userId', conversationControllers.getConversationListByUserId);

export default conversationRouter;
