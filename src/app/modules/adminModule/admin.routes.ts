import express from 'express';
import adminControllers from './admin.controllers';
import authentication from '../../middlewares/authorization';
import { ENUM_USER_ROLE } from '../../../enums/user';
import requestValidator from '../../middlewares/requestValidator';
import { getDashboardAnalytics } from './admin.validation';

const adminRouter = express.Router();

adminRouter.post('/create', adminControllers.createAdmin);
adminRouter.get('/retrive/all', adminControllers.getAllAdmin);
adminRouter.get('/retrive/:id', adminControllers.getSpecificAdmin);
adminRouter.patch(
  '/update/:id',
  // authorization('super-admin', 'admin'),
  adminControllers.updateSpecificAdmin,
);
adminRouter.delete(
  '/delete/:id',
  // authorization('super-admin'),
  adminControllers.deleteSpecificAdmin,
);

adminRouter.get('/dashboard', requestValidator(getDashboardAnalytics), adminControllers.getDashboardStats);

adminRouter.patch('/block/:id', authentication(ENUM_USER_ROLE.SUPER_ADMIN), adminControllers.blockSpecificAdmin);

export default adminRouter;
