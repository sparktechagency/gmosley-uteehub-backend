import asyncHandler from '../../../shared/asyncHandler';
import Category from './category.model';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import categoryServices from './category.services';
import fileUploader from '../../../utils/fileUploader';
import CustomError from '../../errors';

// controller for create category
const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const categoryData = req.body;
  const files = req.files;
  if (!categoryData.name) {
    throw new Error('Name is required');
  }

  if(files && files.image){
    const imagePath = await fileUploader(files, `category-${Date.now()}`, 'image');
    categoryData.image = imagePath;
  }

  const category = await categoryServices.createCategory(categoryData);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Category created successfully',
    data: category,
  });
});

// controller for get all categories
const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await categoryServices.getAllCategories();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Categories retrieved successfully',
    data: categories,
  });
});

// controller for get specific category
const getSpecificCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await categoryServices.getCategoryById(id);
  if(!category){
    throw new CustomError.BadRequestError('Failed to retrieve category!');
  }
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Category retrieved successfully',
    data: category,
  });
});

// controller for update specific category
const updateSpecificCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const categoryData = req.body;
  const files = req.files;
  if(files && files.image){
    const imagePath = await fileUploader(files, `category-${Date.now()}`, 'image');
    categoryData.image = imagePath;
  }
  const category = await categoryServices.updateCategory(id, categoryData);

  if(!category?.isModified){
    throw new CustomError.BadRequestError('Failed to update category!');
  }
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Category updated successfully'
  });
});

// controller for delete specific category
const deleteSpecificCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await categoryServices.deleteCategory(id);
  if(!category?.$isDeleted){
    throw new CustomError.BadRequestError('Failed to delete category!');
  }
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Category deleted successfully',
  });
});

export default {
  createCategory,
  getAllCategories,
  getSpecificCategory,
  updateSpecificCategory,
  deleteSpecificCategory,
};
