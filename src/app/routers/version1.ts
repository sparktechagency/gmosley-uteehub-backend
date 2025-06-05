import express from 'express';
import userRouter from '../modules/userModule/user.routes';
import adminRouter from '../modules/adminModule/admin.routes';
import userAuthRouter from '../modules/authModule/userAuthModule/auth.routes';
import adminAuthRouter from '../modules/authModule/adminAuthModule/auth.routes';
import aboutUsRouter from '../modules/aboutUsModule/abountUs.routes';
import privacyPolicyRouter from '../modules/privacyPolicyModule/privacyPolicy.routes';
import termsConditionRouter from '../modules/termsConditionModule/termsCondition.routes';
import faqRouter from '../modules/faqModule/faq.routes';
import clientRouter from '../modules/clientModule/client.Route';

const routersVersionOne = express.Router();

// user
routersVersionOne.use('/user', userRouter);
routersVersionOne.use('/admin', adminRouter);

// auth
routersVersionOne.use('/user/auth', userAuthRouter);
routersVersionOne.use('/admin/auth', adminAuthRouter);

// app
routersVersionOne.use('/client', clientRouter);
// routersVersionOne.use('/vendor', vendorRouter);

// settings
routersVersionOne.use('/about-us', aboutUsRouter);
routersVersionOne.use('/privacy-policy', privacyPolicyRouter);
routersVersionOne.use('/terms-condition', termsConditionRouter);
routersVersionOne.use('/faq', faqRouter);

export default routersVersionOne;
