"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = __importDefault(require("../errors"));
const healper_jwt_1 = __importDefault(require("../../healpers/healper.jwt"));
const config_1 = __importDefault(require("../../config"));
const authentication = (...requiredRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            if (!token) {
                throw new errors_1.default.UnAuthorizedError('Unauthorized access!');
            }
            const userPayload = healper_jwt_1.default.verifyToken(token, config_1.default.jwt_access_token_secret);
            if (!userPayload) {
                throw new errors_1.default.UnAuthorizedError('Invalid token!');
            }
            req.user = userPayload;
            // Guard for check authentication
            if (requiredRoles.length && !requiredRoles.includes(userPayload.role)) {
                throw new errors_1.default.ForbiddenError('Forbidden!');
            }
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
exports.default = authentication;
