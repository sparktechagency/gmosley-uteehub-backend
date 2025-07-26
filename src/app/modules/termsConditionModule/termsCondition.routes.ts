import express from 'express';
import termsConditionControllers from './termsCondition.controllers';
import authorization from '../../middlewares/authorization';
import { ENUM_USER_ROLE } from '../../../enums/user';

const termsConditionRouter = express.Router();

// Route to create or update Terms and Conditions content (only accessible to admin or super-admin)
termsConditionRouter.post(
  '/create-or-update',
  authorization(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  termsConditionControllers.createOrUpdateTermsCondition
);

// Route to retrieve Terms and Conditions content (accessible to everyone)
termsConditionRouter.get(
  '/retrive',
  termsConditionControllers.getTermsCondition
);

export default termsConditionRouter;
