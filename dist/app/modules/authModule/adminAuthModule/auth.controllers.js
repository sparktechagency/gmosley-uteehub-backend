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
const errors_1 = __importDefault(require("../../../errors"));
const healper_jwt_1 = __importDefault(require("../../../../healpers/healper.jwt"));
const config_1 = __importDefault(require("../../../../config"));
const sendResponse_1 = __importDefault(require("../../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const IdGenerator_1 = __importDefault(require("../../../../utils/IdGenerator"));
const sendEmail_1 = __importDefault(require("../../../../utils/sendEmail"));
const admin_model_1 = __importDefault(require("../../adminModule/admin.model"));
const asyncHandler_1 = __importDefault(require("../../../../shared/asyncHandler"));
const admin_services_1 = __importDefault(require("../../adminModule/admin.services"));
// controller for admin login
const adminLogin = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const admin = yield admin_services_1.default.getAdminByEmail(email);
    if (!admin)
        throw new errors_1.default.NotFoundError('Invalid email or password!');
    // check the password is correct
    const isPasswordMatch = admin.comparePassword(password);
    if (!isPasswordMatch)
        throw new errors_1.default.BadRequestError('Invalid email or password');
    // generate token
    const payload = {
        email: admin.email,
        role: admin.role,
    };
    const accessToken = healper_jwt_1.default.createToken(payload, config_1.default.jwt_access_token_secret, config_1.default.jwt_access_token_expiresin);
    const refreshToken = healper_jwt_1.default.createToken(payload, config_1.default.jwt_refresh_token_secret, config_1.default.jwt_refresh_token_expiresin);
    const adminInfo = {
        fullName: admin.fullName,
        email: admin.email,
        _id: admin._id,
        accessToken,
        refreshToken,
        status: admin.status,
        role: admin.role,
    };
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: 'success',
        message: 'Login successfull',
        data: adminInfo,
    });
}));
// controller for send otp to admin
const sendOTP = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        throw new errors_1.default.BadRequestError('Missing data in request body!');
    }
    const admin = yield admin_services_1.default.getAdminByEmail(email);
    if (!admin) {
        throw new errors_1.default.NotFoundError('Admin not found!');
    }
    const code = IdGenerator_1.default.generateNumberId();
    const expireDate = new Date();
    expireDate.setMinutes(expireDate.getMinutes() + 5);
    const verification = {
        code,
        expireDate,
    };
    admin.verification = verification;
    yield admin.save();
    // send verification mail
    const textContent = `
        Hi ${admin.fullName},
        
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
    const admin = yield admin_services_1.default.getAdminByEmail(email);
    if (!admin) {
        throw new errors_1.default.NotFoundError('Admin not found!');
    }
    const isMatchOTP = yield admin.compareVerificationCode(otp);
    if (!isMatchOTP) {
        throw new errors_1.default.BadRequestError('Invalid OTP!');
    }
    // set null verification object in admin model
    yield admin_model_1.default.findByIdAndUpdate(admin._id, {
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
    const admin = yield admin_services_1.default.getAdminByEmail(email);
    if (!admin) {
        throw new errors_1.default.NotFoundError('Admin not found!');
    }
    admin.password = newPassword;
    yield admin.save();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: 'success',
        message: 'Password reset successfull',
    });
}));
// controller for change password
const changePassword = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, oldPassword, newPassword } = req.body;
    const admin = yield admin_services_1.default.getAdminByEmail(email);
    if (!admin) {
        throw new errors_1.default.NotFoundError('Admin not found!');
    }
    // compare admin given old password and database saved password
    const isOldPassMatch = yield admin.comparePassword(oldPassword);
    if (!isOldPassMatch) {
        throw new errors_1.default.BadRequestError('Wrong password');
    }
    admin.password = newPassword;
    yield admin.save();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: 'success',
        message: 'Password change successfull',
    });
}));
exports.default = {
    adminLogin,
    sendOTP,
    verifyOTP,
    resetPassword,
    changePassword,
};
