import { NextFunction, Request, Response } from 'express';
import CustomError from '../errors';
import jwtHelpers from '../../healpers/healper.jwt';
import config from '../../config';
import { Secret } from 'jsonwebtoken';

const authentication = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        throw new CustomError.UnAuthorizedError('Unauthorized access!');
      }

      const userPayload = jwtHelpers.verifyToken(token, config.jwt_access_token_secret as Secret);

      if (!userPayload) {
        throw new CustomError.UnAuthorizedError('Invalid token!');
      }
      req.user = userPayload;

      // Guard for check authentication
      if (requiredRoles.length && !requiredRoles.includes(userPayload.role)) {
        throw new CustomError.ForbiddenError('Forbidden!');
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authentication;
