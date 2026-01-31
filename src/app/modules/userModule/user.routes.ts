import express from 'express';
import userControllers from './user.controllers';
import UserValidationZodSchema from './user.validation';
import requestValidator from '../../middlewares/requestValidator';
import authentication from '../../middlewares/authorization';
import { ENUM_USER_ROLE } from '../../../enums/user';

const userRouter = express.Router();

userRouter.post('/create', requestValidator(UserValidationZodSchema.createUserZodSchema), userControllers.createUser);
userRouter.post('/file-upload', userControllers.fileUpload);
userRouter.get('/retrieve/all', userControllers.getAllUser);

userRouter.get('/retrieve/:id', requestValidator(UserValidationZodSchema.getSpecificUserZodSchema), userControllers.getSpecificUser);

userRouter.patch(
  '/update/:id',
  authentication(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.CLIENT, ENUM_USER_ROLE.VENDOR),
  requestValidator(UserValidationZodSchema.getSpecificUserZodSchema),
  userControllers.updateSpecificUser,
);

userRouter.patch(
  '/update-status/:id',
  authentication(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  requestValidator(UserValidationZodSchema.updateUserStatusSchema),
  userControllers.updateUserStatus,
);

// userRouter.delete(
//   '/delete/:id',
//   //   authentication('user', 'admin'),
//   requestValidator(UserValidationZodSchema.getSpecificUserZodSchema),
//   userControllers.deleteSpecificUser,
// );
// userRouter.patch('/update/profile-picture/:id', authentication('patient', 'therapist'), requestValidator(UserValidationZodSchema.getSpecificUserZodSchema), userControllers.changeUserProfileImage)

export default userRouter;
