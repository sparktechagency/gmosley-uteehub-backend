"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controllers_1 = __importDefault(require("./auth.controllers"));
const userAuthRouter = express_1.default.Router();
// outlet also can be login using the route
userAuthRouter.post('/login', auth_controllers_1.default.userLogin);
// route for resend email verification code
userAuthRouter.post('/email-verification/resend-code', auth_controllers_1.default.resendEmailVerificationCode);
// route for user email verify
userAuthRouter.post('/verify-email', auth_controllers_1.default.userEmailVerify);
// route for send password reset OTP
userAuthRouter.post('/forget-password/send-otp', auth_controllers_1.default.sendOTP);
// route for verify OTP
userAuthRouter.post('/verify-otp', auth_controllers_1.default.verifyOTP);
// route for reset password
userAuthRouter.post('/reset-password', auth_controllers_1.default.resetPassword);
// route for change password
userAuthRouter.post('/change-password', auth_controllers_1.default.changePassword);
// route for user stability (get new accesstoken)
userAuthRouter.post('/refresh-token', auth_controllers_1.default.getAccessTokenByRefreshToken);
exports.default = userAuthRouter;
