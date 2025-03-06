import { Request, Response } from 'express';
import BlogService from './blog.services';
import CustomError from '../../errors';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from '../../../shared/asyncHandler';
import fileUploader from '../../../utils/fileUploader';
import { FileArray } from 'express-fileupload';

class BlogController {
  createBlog = asyncHandler(async (req: Request, res: Response) => {
    const blogData = req.body;
    const files = req.files;

    if (files && files.image) {
      const imagePath = await fileUploader(files as FileArray, `${blogData.title}-image`, 'image');
      blogData.image = imagePath;
    }

    const newBlog = await BlogService.createBlog(blogData);

    if (!newBlog) {
      throw new CustomError.BadRequestError('Failed to create blog!');
    }

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      status: 'success',
      message: 'Blog created successfully',
      data: newBlog,
    });
  });

  getBlogs = asyncHandler(async (req: Request, res: Response) => {
    const blogs = await BlogService.getBlogs();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Blogs retrieved successfully',
      data: blogs,
    });
  });

  getBlogById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const blog = await BlogService.getBlogById(id);

    if (!blog) {
      throw new CustomError.NotFoundError('Blog not found!');
    }

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Blog retrieved successfully',
      data: blog,
    });
  });

  updateBlog = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const blogData = req.body;
    const updatedBlog = await BlogService.updateBlog(id, blogData);

    if (!updatedBlog?.isModified) {
      throw new CustomError.BadRequestError('Failed to update blog!');
    }

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Blog updated successfully',
    });
  });

  deleteBlog = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedBlog = await BlogService.deleteBlog(id);

    if (!deletedBlog?.deletedCount) {
      throw new CustomError.BadRequestError('Failed to delete blog!');
    }

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Blog deleted successfully',
    });
  });
}

export default new BlogController();
