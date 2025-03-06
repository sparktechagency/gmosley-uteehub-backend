import { Request, Response } from 'express';
import AboutUs from './aboutUs.model';
import CustomError from '../../errors';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse';
import asyncHandler from '../../../shared/asyncHandler';

// Controller to create or update About Us content
const createOrUpdateAboutUs = asyncHandler(async (req: Request, res: Response) => {
  const { description } = req.body;

  // Check if About Us exists; if it does, update, otherwise create
  const existingAboutUs = await AboutUs.findOne();

  if (existingAboutUs) {
    // Update the existing About Us record
    const updatedAboutUs = await AboutUs.updateOne({ _id: existingAboutUs._id }, { description }, { runValidators: true });

    if (!updatedAboutUs.modifiedCount) {
      throw new CustomError.BadRequestError('Failed to update About Us');
    }

    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'About Us updated successfully',
    });
  } else {
    // Create a new About Us record
    const newAboutUs = await AboutUs.create({ description });

    if (!newAboutUs) {
      throw new CustomError.BadRequestError('Failed to create About Us');
    }

    return sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      status: 'success',
      message: 'About Us created successfully',
    });
  }
});

// Controller to get About Us content
const getAboutUs = asyncHandler(async (req: Request, res: Response) => {
  const aboutUs = await AboutUs.findOne();

  if (!aboutUs) {
    throw new CustomError.NotFoundError('No About Us found!');
  }

  return sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'About Us content retrieved successfully',
    data: aboutUs,
  });
});

export default {
  createOrUpdateAboutUs,
  getAboutUs,
};
