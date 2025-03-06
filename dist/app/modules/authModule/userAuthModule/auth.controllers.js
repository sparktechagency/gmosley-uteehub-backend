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
const auth_services_1 = __importDefault(require("./auth.services"));
const healper_jwt_1 = __importDefault(require("../../../../healpers/healper.jwt"));
const config_1 = __importDefault(require("../../../../config"));
const sendResponse_1 = __importDefault(require("../../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const IdGenerator_1 = __importDefault(require("../../../../utils/IdGenerator"));
const sendEmail_1 = __importDefault(require("../../../../utils/sendEmail"));
const user_model_1 = __importDefault(require("../../userModule/user.model"));
const errors_1 = __importDefault(require("../../../errors"));
const asyncHandler_1 = __importDefault(require("../../../../shared/asyncHandler"));
// controller for user/outlet login
const userLogin = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, isSocial, fcmToken } = req.body;
    const user = yield auth_services_1.default.getUserByEmail(email);
    if (!user)
        throw new errors_1.default.BadRequestError('Invalid email or password!');
    // check user disablility
    if (user.status === 'disabled') {
        throw new errors_1.default.BadRequestError('Your current account is disabled!');
    }
    if (user.status === 'blocked') {
        throw new errors_1.default.BadRequestError('Currently your account is blocked by admin!');
    }
    if (!isSocial) {
        // check the password is correct
        const isPasswordMatch = user.comparePassword(password);
        if (!isPasswordMatch)
            throw new errors_1.default.BadRequestError('Invalid email or password');
    }
    // generate token
    const payload = {
        email: user.email,
        role: user.role,
    };
    const accessToken = healper_jwt_1.default.createToken(payload, config_1.default.jwt_access_token_secret, config_1.default.jwt_access_token_expiresin);
    const refreshToken = healper_jwt_1.default.createToken(payload, config_1.default.jwt_refresh_token_secret, config_1.default.jwt_refresh_token_expiresin);
    const userInfo = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        _id: user._id,
        role: user.role,
        accessToken,
        refreshToken,
        isEmailVerified: isSocial ? true : user.isEmailVerified,
    };
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: 'success',
        message: `User login successfull`,
        data: userInfo,
    });
}));
// controller for resend email verification code
const resendEmailVerificationCode = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const code = IdGenerator_1.default.generateNumberId();
    const expireDate = new Date();
    expireDate.setMinutes(expireDate.getMinutes() + 5);
    const verification = {
        code: code,
        expireDate,
    };
    const user = yield auth_services_1.default.getUserByEmail(email);
    if (!user) {
        throw new errors_1.default.NotFoundError('User not found!');
    }
    user.verification = verification;
    yield user.save();
    // send email verification mail
    const content = `Your email veirfication code is ${verification === null || verification === void 0 ? void 0 : verification.code}`;
    // const verificationLink = `${config.server_base_url}/v1/auth/verify-email/${user._id}?userCode=${verification.code}`
    // const content = `Click the following link to verify your email: ${verificationLink}`
    const mailOptions = {
        from: config_1.default.gmail_app_user,
        to: email,
        subject: 'Email Verification',
        text: content,
    };
    (0, sendEmail_1.default)(mailOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: 'success',
        message: 'Email verification code resend successfull',
    });
}));
// controller for verify email
const userEmailVerify = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { email, code } = req.body;
    const user = yield auth_services_1.default.getUserByEmail(email);
    if (!user) {
        throw new errors_1.default.NotFoundError('User not found!');
    }
    // const user = await authServices.getUserByEmail(email)
    // if (!user) throw new CustomError.BadRequestError('User not found!')
    const isVerificationCodeMatch = user.compareVerificationCode(code);
    if (!isVerificationCodeMatch) {
        throw new errors_1.default.BadRequestError('Invalid code!');
    }
    const now = new Date();
    if (((_a = user.verification) === null || _a === void 0 ? void 0 : _a.expireDate) && ((_b = user.verification) === null || _b === void 0 ? void 0 : _b.expireDate) < now) {
        throw new errors_1.default.BadRequestError('Sorry, Email verification Code using date expired!');
    }
    // update the email verification status of user
    yield user_model_1.default.findByIdAndUpdate(user._id, { isEmailVerified: true });
    yield user_model_1.default.findByIdAndUpdate(user._id, {
        verification: { code: null, expireDate: null },
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: 'success',
        message: 'Email verification successfull',
    });
}));
// controller for send otp
const sendOTP = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        throw new errors_1.default.BadRequestError('Missing data in request body!');
    }
    const userExistance = yield auth_services_1.default.getUserByEmail(email);
    if (!userExistance) {
        throw new errors_1.default.NotFoundError('User not found!');
    }
    const code = IdGenerator_1.default.generateNumberId();
    const expireDate = new Date();
    expireDate.setMinutes(expireDate.getMinutes() + 5);
    const verification = {
        code,
        expireDate,
    };
    userExistance.verification = verification;
    yield userExistance.save();
    // send verification mail
    const textContent = `
      Hi,
      
      You have requested to reset your password. Please use the following One-Time Password (OTP) to complete the process. This OTP is valid for 5 minutes.
      
      Your OTP: ${code}
      
      If you did not request this, please ignore this email and your password will remain unchanged.
      
      For security reasons, do not share this OTP with anyone.
      
      Best regards,
      `;
    const mailOptions = {
        from: config_1.default.gmail_app_user,
        to: email,
        subject: 'Password Reset OTP',
        text: textContent,
    };
    (0, sendEmail_1.default)(mailOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: 'success',
        message: 'Password reset OTP sended successfull.',
    });
}));
// controller for verify otp
const verifyOTP = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    if (!email || !otp) {
        throw new errors_1.default.BadRequestError('Missing data in request body!');
    }
    const userExistance = yield auth_services_1.default.getUserByEmail(email);
    if (!userExistance) {
        throw new errors_1.default.NotFoundError('User not found!');
    }
    const isMatchOTP = userExistance.compareVerificationCode(otp);
    if (!isMatchOTP) {
        throw new errors_1.default.BadRequestError('Invalid OTP!');
    }
    // set null verification object in user model
    yield user_model_1.default.findByIdAndUpdate(userExistance._id, {
        verification: { code: null, expireDate: null },
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: 'success',
        message: 'OTP match successfull',
    });
}));
// controller for reset password
const resetPassword = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
        throw new errors_1.default.BadRequestError('Missing data in request body!');
    }
    const userExistance = yield auth_services_1.default.getUserByEmail(email);
    if (!userExistance) {
        throw new errors_1.default.NotFoundError('User not found!');
    }
    userExistance.password = newPassword;
    yield userExistance.save();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: 'success',
        message: 'Password reset successfull',
    });
}));
// controller for change password
const changePassword = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, oldPassword, newPassword } = req.body;
    const userExistance = yield auth_services_1.default.getUserByEmail(email);
    if (!userExistance) {
        throw new errors_1.default.NotFoundError('User not found!');
    }
    // compare user given old password and database saved password
    const isOldPassMatch = userExistance.comparePassword(oldPassword);
    if (!isOldPassMatch) {
        throw new errors_1.default.BadRequestError('Wrong password');
    }
    userExistance.password = newPassword;
    yield userExistance.save();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: 'success',
        message: 'Password change successfull',
    });
}));
// controller for get access token by refresh token
const getAccessTokenByRefreshToken = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refresh_token } = req.body;
    const actualRefreshToken = refresh_token.split(' ')[1];
    const tokenPayload = healper_jwt_1.default.verifyToken(actualRefreshToken, config_1.default.jwt_refresh_token_secret);
    if (!tokenPayload) {
        throw new errors_1.default.BadRequestError('Invalid refresh token!');
    }
    const user = yield auth_services_1.default.getUserByEmail(tokenPayload.email);
    if (!user) {
        throw new errors_1.default.NotFoundError('User not found!');
    }
    const payload = {
        email: user.email,
        roles: user.role,
    };
    const newAccessToken = healper_jwt_1.default.createToken(payload, config_1.default.jwt_access_token_secret, config_1.default.jwt_access_token_expiresin);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: 'success',
        message: 'New access token created using refresh token. User logged In successful',
        data: {
            accessToken: newAccessToken,
            refreshToken: actualRefreshToken,
        },
    });
}));
exports.default = {
    userLogin,
    resendEmailVerificationCode,
    userEmailVerify,
    sendOTP,
    verifyOTP,
    resetPassword,
    changePassword,
    getAccessTokenByRefreshToken,
};
