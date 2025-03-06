import express from 'express';
import termsConditionControllers from './termsCondition.controllers';
import authorization from '../../middlewares/authorization';

const termsConditionRouter = express.Router();

// Route to create or update Terms and Conditions content (only accessible to admin or super-admin)
termsConditionRouter.post(
  '/create-or-update',
  authorization('super-admin', 'admin'),
  termsConditionControllers.createOrUpdateTermsCondition
);

// Route to retrieve Terms and Conditions content (accessible to everyone)
termsConditionRouter.get(
  '/retrive',
  termsConditionControllers.getTermsCondition
);

export default termsConditionRouter;
