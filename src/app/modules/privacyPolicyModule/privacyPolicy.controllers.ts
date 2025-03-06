import { Request, Response } from 'express';
import PrivacyPolicy from './privacyPolicy.model';
import CustomError from '../../errors';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse';
import asyncHandler from '../../../shared/asyncHandler';

// Controller to create or update Privacy Policy content
const createOrUpdatePrivacyPolicy = asyncHandler(async (req: Request, res: Response) => {
  const { privacyPolicy } = req.body;

  // Check if Privacy Policy exists; if it does, update, otherwise create
  const existingPrivacyPolicy = await PrivacyPolicy.findOne();

  if (existingPrivacyPolicy) {
    // Update the existing Privacy Policy record
    const updatedPrivacyPolicy = await PrivacyPolicy.updateOne(
      { _id: existingPrivacyPolicy._id },
      { privacyPolicy },
      { runValidators: true },
    );

    if (!updatedPrivacyPolicy.modifiedCount) {
      throw new CustomError.BadRequestError('Failed to update Privacy Policy');
    }

    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Privacy Policy updated successfully',
    });
  } else {
    // Create a new Privacy Policy record
    const newPrivacyPolicy = await PrivacyPolicy.create({ privacyPolicy });

    if (!newPrivacyPolicy) {
      throw new CustomError.BadRequestError('Failed to create Privacy Policy');
    }

    return sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      status: 'success',
      message: 'Privacy Policy created successfully',
    });
  }
});

// Controller to get Privacy Policy content
const getPrivacyPolicy = asyncHandler(async (req: Request, res: Response) => {
  const privacyPolicy = await PrivacyPolicy.findOne();

  if (!privacyPolicy) {
    throw new CustomError.NotFoundError('No Privacy Policy found!');
  }

  return sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Privacy Policy content retrieved successfully',
    data: privacyPolicy,
  });
});

export default {
  createOrUpdatePrivacyPolicy,
  getPrivacyPolicy,
};
