import express from 'express';
import aboutUsControllers from './aboutUs.controllers';
import authorization from '../../middlewares/authorization';

const aboutUsRouter = express.Router();

// Route to create or update About Us content (only accessible to admin or super-admin)
aboutUsRouter.post('/create-or-update', authorization('super-admin', 'admin'), aboutUsControllers.createOrUpdateAboutUs);

// Route to retrieve About Us content (accessible to everyone)
aboutUsRouter.get('/retrive', aboutUsControllers.getAboutUs);

export default aboutUsRouter;
