import express from 'express';
import adminControllers from './admin.controllers';
import authorization from '../../middlewares/authorization';

const adminRouter = express.Router();

adminRouter.post('/create', adminControllers.createAdmin);
adminRouter.get('/retrive/all', adminControllers.getAllAdmin);
adminRouter.get('/retrive/:id', adminControllers.getSpecificAdmin);
adminRouter.patch('/update/:id', 
// authorization('super-admin', 'admin'), 
adminControllers.updateSpecificAdmin);
adminRouter.delete('/delete/:id', 
// authorization('super-admin'), 
adminControllers.deleteSpecificAdmin);

export default adminRouter;
