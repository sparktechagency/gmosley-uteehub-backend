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

// retrieve all nearest vendors based on client location plus delivery location
const getNearestVendors = asyncHandler(async (req: Request, res: Response) => {
  const { clientLocation } = req.body;
  if(!clientLocation){
    throw new Error('clientLocation is required');
  }
  const result = await vendorServices.retrieveNearestVendor(clientLocation as string);
  if(!result){
    throw new Error('No nearest vendor found');
  }
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
  getNearestVendors,
};
