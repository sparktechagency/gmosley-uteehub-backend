"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_badRequest_1 = __importDefault(require("./error.badRequest"));
const error_forbidden_1 = __importDefault(require("./error.forbidden"));
const error_notFound_1 = __importDefault(require("./error.notFound"));
const error_unAuthorized_1 = __importDefault(require("./error.unAuthorized"));
const CustomError = {
    BadRequestError: error_badRequest_1.default,
    ForbiddenError: error_forbidden_1.default,
    NotFoundError: error_notFound_1.default,
    UnAuthorizedError: error_unAuthorized_1.default,
};
exports.default = CustomError;
