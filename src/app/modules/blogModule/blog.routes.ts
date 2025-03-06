import { Router } from 'express';
import BlogController from './blog.controllers';

const blogRouter = Router();

blogRouter.post('/create', BlogController.createBlog);
blogRouter.get('/retrieve/all', BlogController.getBlogs);
blogRouter.get('/retrieve/:id', BlogController.getBlogById);
blogRouter.patch('/update/:id', BlogController.updateBlog);
blogRouter.delete('/delete/:id', BlogController.deleteBlog);

export default blogRouter;