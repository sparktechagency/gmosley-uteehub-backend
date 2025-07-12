import express from 'express';
import productControllers from './product.controllers';
import { ENUM_USER_ROLE } from '../../../enums/user';
import authorization from '../../middlewares/authorization';

const productRouter = express.Router();

productRouter.post('/create', authorization(ENUM_USER_ROLE.VENDOR), productControllers.createProduct);
productRouter.get('/retrieve', productControllers.getAllProducts);
productRouter.get('/retrieve/:id', productControllers.getSpecificProduct);
productRouter.patch('/update/:id', authorization(ENUM_USER_ROLE.VENDOR), productControllers.updateSpecificProduct);
productRouter.delete('/delete/:id', authorization(ENUM_USER_ROLE.VENDOR), productControllers.deleteSpecificProduct);

export default productRouter;
