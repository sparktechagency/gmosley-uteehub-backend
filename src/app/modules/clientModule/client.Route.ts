
import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import authentication from '../../middlewares/authorization';
import clientController from './client.controller';

const clientRouter = express.Router();

clientRouter.get('/get-all-clients', authentication(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN
), clientController.getAllClientProfile);


clientRouter.get('/details/:id', authentication(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN
), clientController.getClientDetails);

export default clientRouter;
