import { Request, Response } from 'express';
import asyncHandler from '../../../shared/asyncHandler';
import contactUsService from './contactUs.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import CustomError from '../../errors';
import sendMail from '../../../utils/sendEmail';
import config from '../../../config';

// controller for create or update contactUs
const createOrUpdateContactUs = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;
  const existContactUs = await contactUsService.getContactUs();
  if (existContactUs) {
    const contactUs = await contactUsService.updateSpecificContactUs(existContactUs._id as string, data);
    if (!contactUs?.isModified) {
      throw new CustomError.BadRequestError('Failed to update Contact Us!');
    }
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Contact Us updated successfully',
    });
  } else {
    const contactUs = await contactUsService.createContactUs(data);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Contact Us created successfully',
      data: contactUs,
    });
  }
});

// controller for get contactUs
const getContactUs = asyncHandler(async (req: Request, res: Response) => {
  const contactUs = await contactUsService.getContactUs();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Contact Us found successfully',
    data: contactUs,
  });
});

// controller for send mail to contactus email
const sendMailToContactUs = asyncHandler(async (req: Request, res: Response) => {
  const { firstName, role, subject, message } = req.body;

  const contactUs = await contactUsService.getContactUs();
  if (!contactUs) {
    throw new CustomError.BadRequestError('No admin email found to send mail!');
  }

  // send verification mail
  const textContent = `
        ${firstName} send you a mail, see below message

        ${message}
        `;

  const mailOptions = {
    from: config.gmail_app_user as string,
    to: contactUs?.email,
    subject: subject,
    text: textContent,
  };

  sendMail(mailOptions);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Mail sent successfully',
  });
});

export default {
  createOrUpdateContactUs,
  getContactUs,
  sendMailToContactUs,
};
