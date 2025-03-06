import express from 'express';
import contactUsControllers from './contactUs.controllers';
import authorization from '../../middlewares/authorization';

const contactUsRouter = express.Router();

contactUsRouter.post('/create-or-update', authorization('super-admin', 'admin'), contactUsControllers.createOrUpdateContactUs);

contactUsRouter.get('/retrive', authorization('super-admin', 'admin'), contactUsControllers.getContactUs);

contactUsRouter.post('/send-email', authorization('super-admin', 'admin', 'patient', 'therapist'), contactUsControllers.sendMailToContactUs);

export default contactUsRouter;
