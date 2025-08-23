import asyncHandler from '../../../shared/asyncHandler';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import productServices from './product.services';
import fileUploader from '../../../utils/fileUploader';
import CustomError from '../../errors';
import userServices from '../userModule/user.services';

// controller for create product
const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const productData = req.body;
  const files = req.files;
  const userId = req.user?.id

  const user = await userServices.getSpecificUser(userId);
  if (!user) {
    throw new CustomError.NotFoundError('User not found!');
  }

  if(user.profile.role !== 'vendor'){
    throw new CustomError.BadRequestError('Only vendor can create product!');
  }
  productData.creator = userId;

  if (files && files.images) {
    const imagePath = await fileUploader(files, `product-${Date.now()}`, 'images');
    productData.images = imagePath;
  }
  productData.size = JSON.parse(productData.size);
  productData.colors = JSON.parse(productData.colors);
  const product = await productServices.createProduct(productData);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Product created successfully',
    data: product,
  });
});

// controller for get all products
const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await productServices.getAllProducts(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Products retrieved successfully',
    data: products,
  });
});

// controller for get specific product
const getSpecificProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await productServices.getProductById(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Product retrieved successfully',
    data: product,
  });
});

// controller for update specific product
const updateSpecificProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const productData = req.body;
  const files = req.files;
  const existingProduct = await productServices.getProductById(id);
  if (!existingProduct) {
    throw new CustomError.BadRequestError('Failed to update product!');
  }
  if (files && files.images) {
    const imagePath = await fileUploader(files, `product-${Date.now()}`, 'images');
    productData.images = imagePath;
  }
  if (productData.size) {
    productData.size = JSON.parse(productData.size);
  }
  if (productData.colors) {
    productData.colors = JSON.parse(productData.colors);
  }

  if (productData.quantity) {
    productData.quantity = Number(productData.quantity) + existingProduct.quantity;
  }

  const product = await productServices.updateProduct(id, productData);
  if(!product?.isModified){
    throw new CustomError.BadRequestError('Failed to update product!');
  }
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Product updated successfully'
  });
});

// controller for delete specific product
const deleteSpecificProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await productServices.deleteProduct(id);
  if(!product?.$isDeleted){
    throw new CustomError.BadRequestError('Failed to delete product!');
  }
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Product deleted successfully',
  });
});

// controller for retrieve products by creator id
const retrieveProductsByCreatorId = asyncHandler(async (req: Request, res: Response) => {
  const { creatorId } = req.params;
  const products = await productServices.retrieveProductsByCreatorId(creatorId, req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Products retrieved successfully',
    data: products,
  });
});

export default {
  createProduct,
  getAllProducts,
  getSpecificProduct,
  updateSpecificProduct,
  deleteSpecificProduct,
  retrieveProductsByCreatorId,
};
