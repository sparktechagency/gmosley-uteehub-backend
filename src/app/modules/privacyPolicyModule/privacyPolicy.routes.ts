import express from 'express';
import privacyPolicyControllers from './privacyPolicy.controllers';
import authorization from '../../middlewares/authorization';
import { ENUM_USER_ROLE } from '../../../enums/user';

const privacyPolicyRouter = express.Router();

// Route to create or update Privacy Policy content (only accessible to admin or super-admin)
privacyPolicyRouter.post(
  '/create-or-update',
  authorization(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  privacyPolicyControllers.createOrUpdatePrivacyPolicy
);

// Route to retrieve Privacy Policy content (accessible to everyone)
privacyPolicyRouter.get(
  '/retrive',
  privacyPolicyControllers.getPrivacyPolicy
);

export default privacyPolicyRouter;
