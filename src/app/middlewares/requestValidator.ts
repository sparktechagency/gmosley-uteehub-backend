import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod'; 
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../shared/sendResponse';

type Schema = {
  safeParse: (input: { body: any; query: any; params: any; cookies: any }) => {
    success: boolean;
    error?: ZodError;
  };
};

const requestValidator = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
      cookies: req.cookies,
    });

    if (!result.success) {
      sendResponse(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        status: 'failed',
        message: 'Request validation error!',
        data: result.error?.errors || [],
      });
      return; 
    }

    return next();
  };
};

export default requestValidator;
