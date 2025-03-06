import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '../../config/logger';

interface ICustomError extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: Record<string, string>;
  errors?: Record<string, { message: string }>;
}

const devErrorResponse = (error: ICustomError, res: Response): Response => {
  return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: error.message,
    errorTrace: error.stack,
  });
};

const prodErrorResponse = (error: ICustomError, res: Response): Response => {
  return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: error.message,
  });
};

const globalErrorHandler = (err: ICustomError, req: Request, res: Response, next: NextFunction): void => {
  err.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  err.message = err.message || 'Something went wrong, try again later';
  res.locals.errorMessage = err.message; 

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError' && err.errors) {
    err.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(',');
    err.statusCode = StatusCodes.BAD_REQUEST;
  }

  // console.log("error here", err)
  // Handle Mongoose Duplicate Key Error (code 11000)
  if (err.code && err.code === 11000) {
    err.message = `${Object.keys(err.keyValue || {}).join(', ')} already exists!`;
    err.statusCode = StatusCodes.BAD_REQUEST; // 400
  }

  // Development vs Production Response
  if (process.env.NODE_ENV?.trim() === 'development') {
    devErrorResponse(err, res);
  } else if (process.env.NODE_ENV?.trim() === 'production') {
    prodErrorResponse(err, res);
  } else {
    prodErrorResponse(err, res);
  }
};

export default globalErrorHandler;
