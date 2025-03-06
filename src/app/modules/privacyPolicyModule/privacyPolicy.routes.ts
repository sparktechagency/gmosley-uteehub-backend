import express from 'express';
import privacyPolicyControllers from './privacyPolicy.controllers';
import authorization from '../../middlewares/authorization';

const privacyPolicyRouter = express.Router();

// Route to create or update Privacy Policy content (only accessible to admin or super-admin)
privacyPolicyRouter.post(
  '/create-or-update',
  authorization('super-admin', 'admin'),
  privacyPolicyControllers.createOrUpdatePrivacyPolicy
);

// Route to retrieve Privacy Policy content (accessible to everyone)
privacyPolicyRouter.get(
  '/retrive',
  privacyPolicyControllers.getPrivacyPolicy
);

export default privacyPolicyRouter;
