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
import fileUploader from '../../../utils/fileUploader';
import mongoose, { ClientSession, Types } from 'mongoose';
import { ENUM_USER_ROLE } from '../../../enums/user';
import clientServices from '../clientModule/client.services';
import vendorServices from '../vendorModule/vendor.services';
import walletUtils from '../walletModule/wallet.utils';
import { CURRENCY_ENUM } from '../../../enums/currency';
import stripe from 'stripe';

const stripeClient = new stripe(config.stripe_secret_key as string);

// controller for create new user
const createUser = asyncHandler(async (req: Request, res: Response) => {
  const userData = req.body;
  const files = req.files;

  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();

  userData.isSocial = userData.isSocial === 'true';

  const expireDate = new Date();
  expireDate.setMinutes(expireDate.getMinutes() + 30);

  userData.verification = {
    code: IdGenerator.generateNumberId(),
    expireDate,
  };

  if (userData.lat && userData.lng) {
    userData.location = {
      type: 'Point',
      coordinates: [Number(userData.lng), Number(userData.lat)],
    };
  }

  if (userData.role === ENUM_USER_ROLE.VENDOR) {
    userData.status = 'pending';
  }

  // token for social user
  let accessToken, refreshToken;
  if (userData.isSocial && userData.role === ENUM_USER_ROLE.CLIENT) {
    userData.isEmailVerified = true;

    const payload = {
      email: userData.email,
      role: userData.role,
    };
    accessToken = jwtHelpers.createToken(payload, config.jwt_access_token_secret as string, config.jwt_access_token_expiresin as string);
    refreshToken = jwtHelpers.createToken(payload, config.jwt_refresh_token_secret as string, config.jwt_refresh_token_expiresin as string);
  }

  if (files && files.documents) {
    const imagePath = await fileUploader(files, `${userData.role}-profile-${Date.now()}`, 'documents');
    userData.documents = imagePath;
  }
  if (files && files.image) {
    const imagePath = await fileUploader(files, `${userData.role}-profile-${Date.now()}`, 'image');
    userData.image = imagePath;
  }

  let user: any;
  try {
    user = await userServices.createUser(userData, session);
    if (!user) {
      throw new CustomError.BadRequestError('Failed to create new user!');
    }

    // Prepare profile payload
    const profilePayload: any = {
      userId: user._id,
    };

    const role = userData.role;

    switch (role) {
      case ENUM_USER_ROLE.CLIENT:
        Object.assign(profilePayload, {
          name: userData.name,
          gender: userData.gender,
          image: userData.image,
        });
        const clientProfile = await clientServices.createClientProfile(profilePayload, session);
        if (clientProfile) {
          user.profile.id = clientProfile._id as unknown as Types.ObjectId;
          user.profile.role = ENUM_USER_ROLE.CLIENT;
        }
        // console.log(user)
        await user.save({ session });
        break;
      case ENUM_USER_ROLE.VENDOR:
        Object.assign(profilePayload, {
          name: userData.name,
          address: userData.address,
          services: userData.services,
          description: userData.description,
          deliveryOption: userData.deliveryOption,
          documents: userData.documents,
          location: userData.location,
          rating: userData.rating,
          image: userData.image,
        });
        const vendorProfile = await vendorServices.createVendorProfile(profilePayload, session);
        if (vendorProfile) {
          user.profile.id = vendorProfile._id;
          user.profile.role = ENUM_USER_ROLE.VENDOR;
        }
        await user.save({ session });
        await walletUtils.createOrUpdateSpecificWallet(user._id as unknown as string, {
          balance: { amount: userData.balance, currency: CURRENCY_ENUM.USD },
        });
        break;
      default:
        throw new CustomError.BadRequestError('Invalid role!');
    }
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
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
      subject: 'U-Tee-Hub - Email Verification',
      text: content,
    };

    sendMail(mailOptions);
  }
  // console.log(userData.role, ENUM_USER_ROLE.VENDOR)
  // create stripe account for vendor (Apatotoo comment kore rakhchi, client theke stripe login kore nite hobe)
  if (userData.role === ENUM_USER_ROLE.VENDOR) {
    const stripeAccount = await stripeClient.accounts.create({
      type: 'express',
      country: 'US',
      email: userData.email,
      business_profile: {
        name: userData.name,
      },
      capabilities: {
        transfers: { requested: true }  // <-- request transfers capability
      }
    });


    
    // console.log(stripeAccount)

    userInfoAcceptPass.stripeAccountId = stripeAccount.id;
    console.log(stripeAccount.id)
    user.stripeAccountId = stripeAccount.id;
    console.log("user", user)
    await user.save();

    // 2️⃣ Create Stripe onboarding link
  const accountLink = await stripeClient.accountLinks.create({
    account: stripeAccount.id,
    refresh_url: 'https://yourapp.com/onboarding/refresh',
    return_url: 'https://yourapp.com/onboarding/complete',
    type: 'account_onboarding',
  });
console.log(accountLink)
  // 3️⃣ Send onboarding link via email
  const mailOptions = {
    from: config.gmail_app_user as string,
    to: userData.email,
    subject: 'Complete Your Stripe Onboarding',
    text: `Hi ${userData.name},\n\nPlease complete your Stripe onboarding to receive payouts:\n\n${accountLink.url}\n\nNote: This link is valid for 24 hours.`,
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
  const query = req.query;
  query.fields = '-password -verification -__v -isDeleted';
  const result = await userServices.getAllUser(query as Record<string, unknown>);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'User retrive successfull',
    meta: result.meta,
    data: result.data,
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
  const files = req.files;

  // Prevent sensitive fields from being updated directly
  if (userData.password || userData.email || userData.isEmailVerified) {
    throw new CustomError.BadRequestError("You can't update email, verified status, or password directly!");
  }

  const existingUser = await userServices.getSpecificUser(id);
  if (!existingUser) {
    throw new CustomError.NotFoundError('User not found!');
  }

  const session: ClientSession = await mongoose.startSession();
  try {
    session.startTransaction();

    if (userData.lat && userData.lng) {
      userData.location = {
        type: 'Point',
        coordinates: [Number(userData.lng), Number(userData.lat)],
      };
    }

    if (files && files.image) {
      const imagePath = await fileUploader(files, `${existingUser.profile.role}-profile-${Date.now()}`, 'image');
      userData.image = imagePath;
    }

    if (files && files.documents) {
      const imagePath = await fileUploader(files, `${existingUser.profile.role}-profile-${Date.now()}`, 'documents');
      userData.documents = imagePath;
    }

    let updatedUser: any;

    // Role-based field whitelisting
    switch (existingUser.profile.role) {
      case ENUM_USER_ROLE.CLIENT: {
        const clientUpdatePayload = {
          name: userData.name,
          gender: userData.gender,
          image: userData.image,
        };
        updatedUser = await clientServices.updateSpecificClientProfile(
          existingUser.profile.id as unknown as string,
          clientUpdatePayload,
          session,
        );
        await userServices.updateSpecificUser(id, userData, session);
        break;
      }

      case ENUM_USER_ROLE.VENDOR: {
        let location;
        if (userData.lng && userData.lat) {
          location = {
            type: 'Point',
            coordinates: [Number(userData.lng), Number(userData.lat)],
          }
        }

        const vendorUpdatePayload = {
          name: userData.name,
          address: userData.address,
          services: userData.services,
          description: userData.description,
          deliveryOption: userData.deliveryOption,
          documents: userData.documents,
          radius: userData.radius,
          rating: userData.rating,
          image: userData.image,
          location,
          status: userData.status
        };
        updatedUser = await vendorServices.updateSpecificVendor(existingUser.profile.id as unknown as string, vendorUpdatePayload, session);
        await userServices.updateSpecificUser(id, userData, session);
        break;
      }

      default:
        updatedUser = await userServices.updateSpecificUser(id, userData, session);
    }
    if (!updatedUser?.isModified) {
      throw new CustomError.BadRequestError('Failed to update user!');
    }

    await session.commitTransaction();
    session.endSession();

    if (existingUser.profile.role === ENUM_USER_ROLE.VENDOR && userData.status === 'pending' && updatedUser.status === 'active') {
      // send email verification mail
      const content = `Your account now activated!`;
      // const verificationLink = `${server_base_url}/v1/auth/verify-email/${user._id}?userCode=${userData.verification.code}`
      // const content = `Click the following link to verify your email: ${verificationLink}`
      const mailOptions = {
        from: config.gmail_app_user as string,
        to: userData.email,
        subject: 'U-Tee-Hub - Account Activated',
        text: content,
      };

      sendMail(mailOptions);
    }

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'User updated successfully',
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

const fileUpload = asyncHandler(async (req: Request, res: Response) => {
  const files = req.files;
  if (!files || !files.file) {
    throw new CustomError.BadRequestError('No files uploaded!');
  }

  const imagePath = await fileUploader(files, `files-${Date.now()}`, 'file');

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'File uploaded successfully',
    data: imagePath,
  });
})

export default {
  createUser,
  getSpecificUser,
  getAllUser,
  // deleteSpecificUser,
  updateSpecificUser,
  // changeUserProfileImage,
  fileUpload,
};
