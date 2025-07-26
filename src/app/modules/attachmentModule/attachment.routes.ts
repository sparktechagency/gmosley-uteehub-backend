import express from 'express';
import authorization from '../../middlewares/authorization';
import attachmentControllers from './attachment.controllers';

const attachmentRouter = express.Router();
attachmentRouter.use(authorization('patient', 'therapist', 'admin', 'super_admin')),
    attachmentRouter.get('/retrive/:conversationId', attachmentControllers.retriveAttachmentByConversation);

export default attachmentRouter;
