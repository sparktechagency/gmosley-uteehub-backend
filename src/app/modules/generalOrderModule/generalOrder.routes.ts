import express from 'express';
import generalOrderControllers from './generalOrder.controllers';

const generalOrderRouter = express.Router();

generalOrderRouter.post('/create', generalOrderControllers.createGeneralOrder);
generalOrderRouter.get('/retrieve', generalOrderControllers.getAllGeneralOrders);
generalOrderRouter.get('/retrieve/:id', generalOrderControllers.getSpecificGeneralOrder);
generalOrderRouter.delete('/delete/:id', generalOrderControllers.deleteGeneralOrder);
generalOrderRouter.patch('/update/:id', generalOrderControllers.updateGeneralOrder);

export default generalOrderRouter;
