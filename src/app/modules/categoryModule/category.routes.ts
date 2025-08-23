import express from 'express';
import authorization from '../../middlewares/authorization';
import categoryControllers from './category.controllers';

const categoryRouter = express.Router();
// categoryRouter.use(authorization('vendor'));

// Route to create category (only accessible to vendor)
categoryRouter.post('/create', categoryControllers.createCategory);

// Route to retrieve all categories (accessible to everyone)
categoryRouter.get('/retrieve', categoryControllers.getAllCategories);

// Route to retrieve specific category (accessible to everyone)
categoryRouter.get('/retrieve/:id', categoryControllers.getSpecificCategory);

// Route to update specific category (only accessible to vendor)
categoryRouter.patch('/update/:id', categoryControllers.updateSpecificCategory);

// Route to delete specific category (only accessible to vendor)
categoryRouter.delete('/delete/:id', categoryControllers.deleteSpecificCategory);

// Route to retrieve categories by creator id (only accessible to vendor)
categoryRouter.get('/retrieve/vendor/:creatorId', categoryControllers.retrieveCategoriesByCreatorId);

export default categoryRouter;
