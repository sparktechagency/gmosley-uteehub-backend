import express from 'express';
import authorization from '../../middlewares/authorization';
import messageControllers from './message.controllers';

const messageRouter = express.Router();
messageRouter.use(authorization('super-admin', 'admin', 'patient', 'therapist'));

messageRouter.post('/send', messageControllers.createMessage);
messageRouter.get('/retrive/:conversationId', messageControllers.retriveMessagesByConversation);

export default messageRouter;
