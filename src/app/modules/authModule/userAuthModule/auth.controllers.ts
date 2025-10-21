import { Request, Response } from 'express';
import authServices from './auth.services';
import jwtHelpers from '../../../../healpers/healper.jwt';
import config from '../../../../config';
import { Secret } from 'jsonwebtoken';
import sendResponse from '../../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import IdGenerator from '../../../../utils/IdGenerator';
import sendMail from '../../../../utils/sendEmail';
import User from '../../userModule/user.model';
import CustomError from '../../../errors';
import asyncHandler from '../../../../shared/asyncHandler';
import stripe from 'stripe';

const stripeClient = new stripe(config.stripe_secret_key as string);

// controller for user/outlet login
const userLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, isSocial, fcmToken } = req.body;

  const user: any = await authServices.getUserByEmail(email);

  if (!user) throw new CustomError.BadRequestError('Invalid email or password!');

//     const stripeAccount = await stripeClient.accounts.retrieve(user.stripeAccountId);
// console.log(stripeAccount.capabilities)
// if (stripeAccount.capabilities?.transfers !== 'active') {
//   throw new CustomError.BadRequestError('Please complete Stripe onboarding. Check your email for the link.');
// }


  // check user disablility
  if (user.status === 'disabled') {
    throw new CustomError.BadRequestError('Your current account is disabled!');
  }
  if (user.status === 'blocked') {
    throw new CustomError.BadRequestError('Currently your account is blocked by admin!');
  }
  if(user.status === 'pending'){
    throw new CustomError.BadRequestError('Your account is not approved yet!');
  }


  if (!isSocial) {
    // check the password is correct
    const isPasswordMatch = user.comparePassword(password);
    if (!isPasswordMatch) throw new CustomError.BadRequestError('Invalid email or password');
  }

  // generate token
  const payload = {
    id: user._id,
    email: user.email,
    role: user.profile.role,
  };

  const accessToken = jwtHelpers.createToken(
    payload as typeof payload,
    config.jwt_access_token_secret as Secret,
    config.jwt_access_token_expiresin as string,
  );

  const refreshToken = jwtHelpers.createToken(
    payload as typeof payload,
    config.jwt_refresh_token_secret as Secret,
    config.jwt_refresh_token_expiresin as string,
  );

  const userInfo = {
    name: user.profile.id.name,
    email: user.email,
    _id: user._id,
    role: user.profile.role,
    accessToken,
    refreshToken,
    isEmailVerified: isSocial ? true : user.isEmailVerified,
  };

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: `User login successfull`,
    data: userInfo,
  });
});

// controller for resend email verification code
const resendEmailVerificationCode = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const code = IdGenerator.generateNumberId();
  const expireDate = new Date();
  expireDate.setMinutes(expireDate.getMinutes() + 5);
  const verification = {
    code: code,
    expireDate,
  };

  const user = await authServices.getUserByEmail(email);
  if (!user) {
    throw new CustomError.NotFoundError('User not found!');
  }

  user.verification = verification;
  await user.save();

  // send email verification mail
  const content = `Your email veirfication code is ${verification?.code}`;
  // const verificationLink = `${config.server_base_url}/v1/auth/verify-email/${user._id}?userCode=${verification.code}`
  // const content = `Click the following link to verify your email: ${verificationLink}`
  const mailOptions = {
    from: config.gmail_app_user as string,
    to: email,
    subject: 'Illuminate Muslim Minds - Email Verification',
    text: content,
  };

  sendMail(mailOptions);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Email verification code resend successfull',
  });
});

// controller for verify email
const userEmailVerify = asyncHandler(async (req: Request, res: Response) => {
  const { email, code } = req.body;

  const user = await authServices.getUserByEmail(email);
  if (!user) {
    throw new CustomError.NotFoundError('User not found!');
  }
  // const user = await authServices.getUserByEmail(email)
  // if (!user) throw new CustomError.BadRequestError('User not found!')

  const isVerificationCodeMatch = user.compareVerificationCode(code);
  if (!isVerificationCodeMatch) {
    throw new CustomError.BadRequestError('Invalid code!');
  }

  const now = new Date();
  if (user.verification?.expireDate && user.verification?.expireDate < now) {
    throw new CustomError.BadRequestError('Sorry, Email verification Code using date expired!');
  }

  // update the email verification status of user

  await User.findByIdAndUpdate(user._id, { isEmailVerified: true });
  await User.findByIdAndUpdate(user._id, {
    verification: { code: null, expireDate: null },
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Email verification successfull',
  });
});

// controller for send otp
const sendOTP = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    throw new CustomError.BadRequestError('Missing data in request body!');
  }

  const userExistance = await authServices.getUserByEmail(email);
  if (!userExistance) {
    throw new CustomError.NotFoundError('User not found!');
  }

  const code = IdGenerator.generateNumberId();
  const expireDate = new Date();
  expireDate.setMinutes(expireDate.getMinutes() + 5);
  const verification = {
    code,
    expireDate,
  };

  userExistance.verification = verification;
  await userExistance.save();

  // send verification mail
  const textContent = `
      Hi,
      
      You have requested to reset your password. Please use the following One-Time Password (OTP) to complete the process. This OTP is valid for 5 minutes.
      
      Your OTP: ${code}
      
      If you did not request this, please ignore this email and your password will remain unchanged.
      
      For security reasons, do not share this OTP with anyone.
      
      Best regards,
      `;

  const mailOptions = {
    from: config.gmail_app_user as string,
    to: email,
    subject: 'Password Reset OTP',
    text: textContent,
  };

  sendMail(mailOptions);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Password reset OTP sended successfull.',
  });
});

// controller for verify otp
const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    throw new CustomError.BadRequestError('Missing data in request body!');
  }

  const userExistance = await authServices.getUserByEmail(email);
  if (!userExistance) {
    throw new CustomError.NotFoundError('User not found!');
  }

  const isMatchOTP = userExistance.compareVerificationCode(otp);
  if (!isMatchOTP) {
    throw new CustomError.BadRequestError('Invalid OTP!');
  }

  // set null verification object in user model

  await User.findByIdAndUpdate(userExistance._id, {
    verification: { code: null, expireDate: null },
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'OTP match successfull',
  });
});

// controller for reset password
const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    throw new CustomError.BadRequestError('Missing data in request body!');
  }

  const userExistance = await authServices.getUserByEmail(email);
  if (!userExistance) {
    throw new CustomError.NotFoundError('User not found!');
  }

  userExistance.password = newPassword;
  await userExistance.save();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Password reset successfull',
  });
});

// controller for change password
const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { email, oldPassword, newPassword } = req.body;

  const userExistance = await authServices.getUserByEmail(email);
  if (!userExistance) {
    throw new CustomError.NotFoundError('User not found!');
  }

  // compare user given old password and database saved password
  const isOldPassMatch = userExistance.comparePassword(oldPassword);
  if (!isOldPassMatch) {
    throw new CustomError.BadRequestError('Wrong password');
  }

  userExistance.password = newPassword;
  await userExistance.save();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Password change successfull',
  });
});

// controller for get access token by refresh token
const getAccessTokenByRefreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refresh_token } = req.body;
  const actualRefreshToken = refresh_token.split(' ')[1];

  const tokenPayload = jwtHelpers.verifyToken(actualRefreshToken, config.jwt_refresh_token_secret as Secret);
  if (!tokenPayload) {
    throw new CustomError.BadRequestError('Invalid refresh token!');
  }

  const user = await authServices.getUserByEmail(tokenPayload.email);

  if (!user) {
    throw new CustomError.NotFoundError('User not found!');
  }

  const payload = {
    id: user._id,
    email: user.email,
    roles: user.profile.role,
  };

  const newAccessToken = jwtHelpers.createToken(
    payload,
    config.jwt_access_token_secret as Secret,
    config.jwt_access_token_expiresin as string,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'New access token created using refresh token. User logged In successful',
    data: {
      accessToken: newAccessToken,
      refreshToken: actualRefreshToken,
    },
  });
});

export default {
  userLogin,
  resendEmailVerificationCode,
  userEmailVerify,
  sendOTP,
  verifyOTP,
  resetPassword,
  changePassword,
  getAccessTokenByRefreshToken,
};
