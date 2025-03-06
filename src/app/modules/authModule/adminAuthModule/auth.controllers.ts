import { Request, Response } from 'express';
import CustomError from '../../../errors';
import jwtHelpers from '../../../../healpers/healper.jwt';
import config from '../../../../config';
import { Secret } from 'jsonwebtoken';
import sendResponse from '../../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import IdGenerator from '../../../../utils/IdGenerator';
import sendMail from '../../../../utils/sendEmail';
import Admin from '../../adminModule/admin.model';
import asyncHandler from '../../../../shared/asyncHandler';
import adminServices from '../../adminModule/admin.services';

// controller for admin login
const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const admin = await adminServices.getAdminByEmail(email);

  if (!admin) throw new CustomError.NotFoundError('Invalid email or password!');

  // check the password is correct
  const isPasswordMatch = admin.comparePassword(password);

  if (!isPasswordMatch) throw new CustomError.BadRequestError('Invalid email or password');

  // generate token
  const payload = {
    email: admin.email,
    role: admin.role,
  };
  const accessToken = jwtHelpers.createToken(
    payload,
    config.jwt_access_token_secret as Secret,
    config.jwt_access_token_expiresin as string,
  );

  const refreshToken = jwtHelpers.createToken(
    payload,
    config.jwt_refresh_token_secret as Secret,
    config.jwt_refresh_token_expiresin as string,
  );

  const adminInfo = {
    fullName: admin.fullName,
    email: admin.email,
    _id: admin._id,
    accessToken,
    refreshToken,
    status: admin.status,
    role: admin.role,
  };

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Login successfull',
    data: adminInfo,
  });
});

// controller for send otp to admin
const sendOTP = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    throw new CustomError.BadRequestError('Missing data in request body!');
  }

  const admin = await adminServices.getAdminByEmail(email);
  if (!admin) {
    throw new CustomError.NotFoundError('Admin not found!');
  }

  const code = IdGenerator.generateNumberId();
  const expireDate = new Date();
  expireDate.setMinutes(expireDate.getMinutes() + 5);
  const verification = {
    code,
    expireDate,
  };

  admin.verification = verification;
  await admin.save();

  // send verification mail
  const textContent = `
        Hi ${admin.fullName},
        
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

  const admin = await adminServices.getAdminByEmail(email);
  if (!admin) {
    throw new CustomError.NotFoundError('Admin not found!');
  }

  const isMatchOTP = await admin.compareVerificationCode(otp);
  if (!isMatchOTP) {
    throw new CustomError.BadRequestError('Invalid OTP!');
  }

  // set null verification object in admin model
  await Admin.findByIdAndUpdate(admin._id, {
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

  const admin = await adminServices.getAdminByEmail(email);
  if (!admin) {
    throw new CustomError.NotFoundError('Admin not found!');
  }

  admin.password = newPassword;
  await admin.save();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Password reset successfull',
  });
});

// controller for change password
const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { email, oldPassword, newPassword } = req.body;

  const admin = await adminServices.getAdminByEmail(email);
  if (!admin) {
    throw new CustomError.NotFoundError('Admin not found!');
  }

  // compare admin given old password and database saved password
  const isOldPassMatch = await admin.comparePassword(oldPassword);
  if (!isOldPassMatch) {
    throw new CustomError.BadRequestError('Wrong password');
  }

  admin.password = newPassword;
  await admin.save();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Password change successfull',
  });
});

export default {
  adminLogin,
  sendOTP,
  verifyOTP,
  resetPassword,
  changePassword,
};
