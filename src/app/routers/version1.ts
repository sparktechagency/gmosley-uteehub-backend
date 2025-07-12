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
import vendorRouter from '../modules/vendorModule/vendor.routes';
import orderRouter from '../modules/orderModule/order.routes';
import supportRouter from '../modules/supportModule/support.routes';
import conversationRouter from '../modules/conversationModule/conversations.routes';
import messageRouter from '../modules/messageModule/message.routes';
import walletRouter from '../modules/walletModule/wallet.routes';
import categoryRouter from '../modules/categoryModule/category.routes';
import productRouter from '../modules/productModule/product.routes';
import generalOrderRouter from '../modules/generalOrderModule/generalOrder.routes';

const routersVersionOne = express.Router();

// user
routersVersionOne.use('/user', userRouter);
routersVersionOne.use('/admin', adminRouter);

// auth
routersVersionOne.use('/user/auth', userAuthRouter);
routersVersionOne.use('/admin/auth', adminAuthRouter);

// app
routersVersionOne.use('/client', clientRouter);
routersVersionOne.use('/vendor', vendorRouter);
routersVersionOne.use('/order', orderRouter);
routersVersionOne.use('/support', supportRouter);
routersVersionOne.use('/conversation', conversationRouter);
routersVersionOne.use('/message', messageRouter);
routersVersionOne.use('/wallet', walletRouter);
routersVersionOne.use('/category', categoryRouter);
routersVersionOne.use('/product', productRouter);
routersVersionOne.use('/general-order', generalOrderRouter);

// settings
routersVersionOne.use('/about-us', aboutUsRouter);
routersVersionOne.use('/privacy-policy', privacyPolicyRouter);
routersVersionOne.use('/terms-condition', termsConditionRouter);
routersVersionOne.use('/faq', faqRouter);

export default routersVersionOne;
