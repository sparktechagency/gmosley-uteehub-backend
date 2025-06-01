import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from '../../../shared/asyncHandler';
import sendResponse from '../../../shared/sendResponse';
import vendorServices from './vendor.services';

const getAllVendorProfile = asyncHandler(async (req: Request, res: Response) => {
  const vendorProfiles = await vendorServices.retrieveAllVendor(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'business profiles retrieved successfully',
    data: vendorProfiles,
    // meta: vendorProfiles.meta,
  });
});

const getSpecificVendorDetails = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await vendorServices.retrieveSpecificVendor(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'data retrievced successfully',
    data: result,
  });
});

export default {
  getAllVendorProfile,
  getSpecificVendorDetails,
};
