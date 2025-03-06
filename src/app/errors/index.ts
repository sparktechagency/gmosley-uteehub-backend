import BadRequestError from './error.badRequest';
import ForbiddenError from './error.forbidden';
import NotFoundError from './error.notFound';
import UnAuthorizedError from './error.unAuthorized';

const CustomError = {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnAuthorizedError,
};

export default CustomError;
