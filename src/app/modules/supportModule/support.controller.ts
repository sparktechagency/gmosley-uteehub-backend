// support.controller.ts
import supportServices from './support.services';
import sendResponse from '../../../shared/sendResponse';
import asyncHandler from '../../../shared/asyncHandler';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import sendMail from '../../../utils/sendEmail';
import config from '../../../config';
import userServices from '../userModule/user.services';
import CustomError from '../../errors';

class SupportController {
  userCreateSupport = asyncHandler(async (req: Request, res: Response) => {
    const { userId, subject, message } = req.body;

    const user: any = await userServices.getSpecificUserWithPopulation(userId);
    if (!user) {
      throw new CustomError.NotFoundError('User not found');
    }
    // console.log(user);
    const userPayload = {
      id: user.id,
      fullName: user.profile.id.name,
      email: user.email,
      role: user.profile.role,
    };

    const support = await supportServices.addUserSupportMessage(userPayload, { message, sender: user.profile.role }, subject);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      status: 'success',
      message: 'Support message sent successfully',
      data: support,
    });
  });

  adminReplySupport = asyncHandler(async (req: Request, res: Response) => {
    const { supportId, message } = req.body;

    const { role: adminRole } = req.user as any;

    const supportData = await supportServices.getSupportById(supportId);
    if (!supportData || !supportData.user) {
      throw new CustomError.NotFoundError('Support not found');
    }

    const user = await userServices.getSpecificUser(supportData.user.id.toString());
    if (!user) throw new CustomError.NotFoundError('User not found');

    const support = await supportServices.addAdminReply(supportId, { message }, adminRole);
    if (!support) throw new CustomError.NotFoundError('Failed to add admin reply');

    // Trigger email to user
    sendMail({
      from: config.gmail_app_user as string,
      to: user.email,
      subject: 'Support Reply from uTeeHub',
      text: message,
    });

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Reply sent successfully',
      data: support,
    });
  });

  composeEmail = asyncHandler(async (req: Request, res: Response) => {
    const { to, subject, body } = req.body;
    if (!to || !subject || !body) {
      throw new CustomError.BadRequestError('All fields are required');
    }

    sendMail({
      from: config.gmail_app_user as string,
      to,
      subject,
      text: body,
    });

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Email composed successfully',
    });
  });

  getAllSupport = asyncHandler(async (req: Request, res: Response) => {
    const query = req.query;
    const support = await supportServices.getAllSupport(query as Record<string, unknown>);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'All support threads fetched',
      data: support,
    });
  });

  getSupportByUserId = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const support = await supportServices.getSupportByUserId(userId);

    // if (!support) {
    //   throw new CustomError.NotFoundError('No support thread found for this user');
    // }

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'User support thread fetched',
      data: support,
    });
  });

  getSupportById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const support = await supportServices.getSupportById(id);

    if (!support) {
      throw new CustomError.NotFoundError('Support thread not found');
    }

    support.isDismissed = true;
    await support.save();

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Support thread fetched',
      data: support,
    });
  });

  deleteSupportById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = await supportServices.deleteSupportById(id);

    if (!deleted) {
      throw new CustomError.NotFoundError('Failed to delete support thread');
    }

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Support thread deleted successfully',
      //   data: deleted,
    });
  });
}

export default new SupportController();
