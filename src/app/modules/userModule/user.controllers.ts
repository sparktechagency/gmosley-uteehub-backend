import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse';
import IdGenerator from '../../../utils/IdGenerator';
import CustomError from '../../errors';
import userServices from './user.services';
import sendMail from '../../../utils/sendEmail';
import { Request, Response } from 'express';
import jwtHelpers from '../../../healpers/healper.jwt';
import config from '../../../config';
import asyncHandler from '../../../shared/asyncHandler';

// controller for create new user
const createUser = asyncHandler(async (req: Request, res: Response) => {
  const userData = req.body;

  const expireDate = new Date();
  expireDate.setMinutes(expireDate.getMinutes() + 30);

  userData.verification = {
    code: IdGenerator.generateNumberId(),
    expireDate,
  };

  // token for social user
  let accessToken, refreshToken;
  if (userData.isSocial) {
    userData.isEmailVerified = true;

    const payload = {
      email: userData.email,
      role: userData.role,
    };
    accessToken = jwtHelpers.createToken(payload, config.jwt_access_token_secret as string, config.jwt_access_token_expiresin as string);
    refreshToken = jwtHelpers.createToken(payload, config.jwt_refresh_token_secret as string, config.jwt_refresh_token_expiresin as string);
  }

  const user = await userServices.createUser(userData);
  if (!user) {
    throw new CustomError.BadRequestError('Failed to create new user!');
  }

  const { password, verification, ...userInfoAcceptPass } = user.toObject();

  if (!userData.isSocial) {
    // send email verification mail
    const content = `Your email veirfication code is ${userData?.verification?.code}`;
    // const verificationLink = `${server_base_url}/v1/auth/verify-email/${user._id}?userCode=${userData.verification.code}`
    // const content = `Click the following link to verify your email: ${verificationLink}`
    const mailOptions = {
      from: config.gmail_app_user as string,
      to: userData.email,
      subject: 'Illuminate Muslim Minds - Email Verification',
      text: content,
    };

    sendMail(mailOptions);
  }

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'User creation successfull',
    data: { ...userInfoAcceptPass, accessToken, refreshToken },
  });
});

// service for get specific user by id
const getSpecificUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userServices.getSpecificUser(id);
  if (!user) {
    throw new CustomError.NotFoundError('User not found!');
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'User retrive successfull',
    data: user,
  });
});

// service for get specific user by id
const getAllUser = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req.query;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 8;

  const skip = (page - 1) * limit;
  const users = await userServices.getAllUser(query as string);

  const totalUsers = users?.length || 0;
  const totalPages = Math.ceil(totalUsers / limit);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'User retrive successfull',
    meta: {
      totalData: totalUsers,
      totalPage: totalPages,
      currentPage: page,
      limit: limit,
    },
    data: users,
  });
});

// controller for delete specific user
// const deleteSpecificUser = asyncHandler(async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { role } = req.user!;
//   const isDelete = await userServices.deleteSpecificUser(id, role);
//   if (!isDelete) {
//     throw new CustomError.BadRequestError('Failed to delete user!');
//   }

//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     status: 'success',
//     message: 'User delete successfull',
//   });
// });

// controller for update specific user
const updateSpecificUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userData = req.body;

  if (userData.password || userData.email || userData.isEmailVerified) {
    throw new CustomError.BadRequestError("You can't update email, verified status and password directly!");
  }

  const updatedUser = await userServices.updateSpecificUser(id, userData);
  // console.log(updatedUser, updatedProfile)
  if (!updatedUser?.isModified) {
    throw new CustomError.BadRequestError('Failed to update user!');
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'User modified successfull',
  });
});

export default {
  createUser,
  getSpecificUser,
  getAllUser,
  // deleteSpecificUser,
  updateSpecificUser,
  // changeUserProfileImage,
};
