import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import authentication from '../../middlewares/authorization';
import vendorController from './vendor.controller';

const vendorRouter = express.Router();

vendorRouter.get(
  '/get-all-vendor-profile',
  authentication(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  vendorController.getAllVendorProfile,
);

vendorRouter.get(
  '/details/:id',
  authentication(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  vendorController.getSpecificVendorDetails,
);

vendorRouter.get(
  '/nearest-all',
  // authentication(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  vendorController.getNearestVendors,
);

export default vendorRouter;
