import { Request, Response } from 'express';
import TermsCondition from './termsCondition.model';
import CustomError from '../../errors';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse';
import asyncHandler from '../../../shared/asyncHandler';

// Controller to create or update Terms and Conditions content
const createOrUpdateTermsCondition = asyncHandler(async (req: Request, res: Response) => {
  const { termsCondition } = req.body;

  // Check if Terms and Conditions content exists; if it does, update, otherwise create
  const existingTermsCondition = await TermsCondition.findOne();

  if (existingTermsCondition) {
    // Update the existing Terms and Conditions record
    const updatedTermsCondition = await TermsCondition.updateOne(
      { _id: existingTermsCondition._id },
      { termsCondition },
      { runValidators: true },
    );

    if (!updatedTermsCondition.modifiedCount) {
      throw new CustomError.BadRequestError('Failed to update Terms and Conditions');
    }

    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Terms and Conditions updated successfully',
    });
  } else {
    // Create a new Terms and Conditions record
    const newTermsCondition = await TermsCondition.create({ termsCondition });

    if (!newTermsCondition) {
      throw new CustomError.BadRequestError('Failed to create Terms and Conditions');
    }

    return sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      status: 'success',
      message: 'Terms and Conditions created successfully',
    });
  }
});

// Controller to get Terms and Conditions content
const getTermsCondition = asyncHandler(async (req: Request, res: Response) => {
  const termsCondition = await TermsCondition.findOne();

  if (!termsCondition) {
    throw new CustomError.NotFoundError('No Terms and Conditions found!');
  }

  return sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Terms and Conditions content retrieved successfully',
    data: termsCondition,
  });
});

export default {
  createOrUpdateTermsCondition,
  getTermsCondition,
};
