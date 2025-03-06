import { Request, Response } from 'express';
import asyncHandler from '../../../shared/asyncHandler';
import faqService from './faq.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

// controller for create new faq
const createNewFaq = asyncHandler(async (req: Request, res: Response) => {
  const { question, answer } = req.body;
  const newFaq = await faqService.createFaq({ question, answer });
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'Faq created successfully',
    data: newFaq,
  });
});

// controller for get all faq
const getAllFaq = asyncHandler(async (req: Request, res: Response) => {
  const faqs = await faqService.getAllFaq();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Faq retrieved successfully',
    data: faqs,
  });
});

// controller for delete specific faq
const deleteSpecificFaq = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedFaq = await faqService.deleteSpecificFaq(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Faq deleted successfully',
    data: deletedFaq,
  });
});

// controller for update specific faq
const updateSpecificFaq = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { question, answer } = req.body;
  const updatedFaq = await faqService.updateSpecificFaq(id, { question, answer });
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Faq updated successfully'
  });
});

export default {
  createNewFaq,
  getAllFaq,
  deleteSpecificFaq,
  updateSpecificFaq,
};
