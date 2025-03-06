import { NextFunction, Request, RequestHandler, Response } from 'express';

const asyncHandler = (controller: RequestHandler) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };

export default asyncHandler;
