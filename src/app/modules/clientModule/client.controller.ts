import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from '../../../shared/asyncHandler';
import sendResponse from '../../../shared/sendResponse';
import clientServices from './client.services';

const getAllClientProfile = asyncHandler(async (req: Request, res: Response) => {

  const clients = await clientServices.retrieveAllClientProfile(req.query);
 
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Vehicle data retrieved successfully',
    data: clients.data,
    // meta: clients.meta,
  });
});

const getClientDetails = asyncHandler(async (req: Request, res: Response) => {
  const {id} = req.params;
  const result = await clientServices.getSpecificClientProfile(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'data retrievced successfully',
    data: result
  });
});

export default {
  getAllClientProfile,
  getClientDetails
};
