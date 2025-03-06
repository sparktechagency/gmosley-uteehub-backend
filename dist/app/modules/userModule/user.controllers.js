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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const IdGenerator_1 = __importDefault(require("../../../utils/IdGenerator"));
const errors_1 = __importDefault(require("../../errors"));
const user_services_1 = __importDefault(require("./user.services"));
const sendEmail_1 = __importDefault(require("../../../utils/sendEmail"));
const healper_jwt_1 = __importDefault(require("../../../healpers/healper.jwt"));
const config_1 = __importDefault(require("../../../config"));
const fileUploader_1 = __importDefault(require("../../../utils/fileUploader"));
const asyncHandler_1 = __importDefault(require("../../../shared/asyncHandler"));
const patientProfile_services_1 = __importDefault(require("../profileModule/patientProfile/patientProfile.services"));
const therapistProfile_services_1 = __importDefault(require("../profileModule/therapistProfile/therapistProfile.services"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_utils_1 = require("./user.utils");
// controller for create new user
const createUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userData = req.body;
    const files = req.files;
    const expireDate = new Date();
    expireDate.setMinutes(expireDate.getMinutes() + 30);
    userData.verification = {
        code: IdGenerator_1.default.generateNumberId(),
        expireDate,
    };
    // token for social user
    let profile, accessToken, refreshToken;
    if (userData.isSocial) {
        userData.isEmailVerified = true;
        const payload = {
            email: userData.email,
            role: userData.role,
        };
        accessToken = healper_jwt_1.default.createToken(payload, config_1.default.jwt_access_token_secret, config_1.default.jwt_access_token_expiresin);
        refreshToken = healper_jwt_1.default.createToken(payload, config_1.default.jwt_refresh_token_secret, config_1.default.jwt_refresh_token_expiresin);
    }
    if (userData.role === 'patient') {
        if (files && files.image) {
            const userImagePath = yield (0, fileUploader_1.default)(files, `user-image`, 'image');
            userData.image = userImagePath;
        }
        profile = yield patientProfile_services_1.default.createPatientProfile(userData);
    }
    if (userData.role === 'therapist') {
        if (files && files.curriculumVitae) {
            const curriculumVitaePath = yield (0, fileUploader_1.default)(files, `curriculum-vitae`, 'curriculumVitae');
            userData.curriculumVitae = curriculumVitaePath;
        }
        if (files && files.certificates) {
            const certificatesPath = yield (0, fileUploader_1.default)(files, `certificates`, 'certificates');
            userData.certificates = certificatesPath;
        }
        if (files && files.brandLogo) {
            const brandLogoPath = yield (0, fileUploader_1.default)(files, `brand-logo`, 'brandLogo');
            userData.brandLogo = brandLogoPath;
        }
        if (files && files.image) {
            const imagePath = yield (0, fileUploader_1.default)(files, `image`, 'image');
            userData.image = imagePath;
        }
        const chargePerHour = JSON.parse(userData.chargePerHour);
        const availabilities = JSON.parse(userData.availabilities);
        availabilities.forEach((day) => {
            if (!day.isClosed) {
                day.slotsPerDay = (0, user_utils_1.slotsPerDayOfAvailities)(day);
            }
        });
        userData.availabilities = availabilities;
        userData.chargePerHour = chargePerHour;
        // console.log(userData)
        profile = yield therapistProfile_services_1.default.createTherapistProfile(userData);
    }
    if (profile) {
        userData.profile = profile._id;
    }
    const user = yield user_services_1.default.createUser(userData);
    if (!user) {
        throw new errors_1.default.BadRequestError('Failed to create new user!');
    }
    if (profile) {
        profile.user = new mongoose_1.default.Types.ObjectId(user._id);
        yield profile.save();
    }
    const _b = user.toObject(), { password } = _b, userInfoAcceptPass = __rest(_b, ["password"]);
    if (!userData.isSocial) {
        // send email verification mail
        const content = `Your email veirfication code is ${(_a = userData === null || userData === void 0 ? void 0 : userData.verification) === null || _a === void 0 ? void 0 : _a.code}`;
        // const verificationLink = `${server_base_url}/v1/auth/verify-email/${user._id}?userCode=${userData.verification.code}`
        // const content = `Click the following link to verify your email: ${verificationLink}`
        const mailOptions = {
            from: config_1.default.gmail_app_user,
            to: userData.email,
            subject: 'Counta - Email Verification',
            text: content,
        };
        (0, sendEmail_1.default)(mailOptions);
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        status: 'success',
        message: 'User creation successfull',
        data: Object.assign(Object.assign({}, userInfoAcceptPass), { accessToken, refreshToken }),
    });
}));
// service for get specific user by id
const getSpecificUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield user_services_1.default.getSpecificUser(id);
    if (!user) {
        throw new errors_1.default.NotFoundError('User not found!');
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: 'success',
        message: 'User retrive successfull',
        data: user,
    });
}));
// service for get specific user by id
const getAllUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_services_1.default.getAllUser();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: 'success',
        message: 'User retrive successfull',
        data: users,
    });
}));
// controller for delete specific user
const deleteSpecificUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { role } = req.user;
    const isDelete = yield user_services_1.default.deleteSpecificUser(id, role);
    if (!isDelete) {
        throw new errors_1.default.BadRequestError('Failed to delete user!');
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: 'success',
        message: 'User delete successfull',
    });
}));
// controller for update specific user
const updateSpecificUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userData = req.body;
    const files = req.files;
    const { role } = req.user;
    if (userData.password || userData.email || userData.isEmailVerified) {
        throw new errors_1.default.BadRequestError("You can't update email, verified status and password directly!");
    }
    // if (files) {
    //   const userImagePath = await fileUploader(files as FileArray, `user-image`, 'image');
    //   userData.image = userImagePath;
    // }
    let updatedProfile;
    if (role === 'patient') {
        if (files && files.image) {
            const userImagePath = yield (0, fileUploader_1.default)(files, `user-image`, 'image');
            userData.image = userImagePath;
        }
        updatedProfile = yield patientProfile_services_1.default.updatePatientProfileByuserId(id, userData);
    }
    if (role === 'therapist') {
        const therapistProfile = yield therapistProfile_services_1.default.getTherapistProfileByUserId(id);
        if (files && files.curriculumVitae) {
            const curriculumVitaePath = yield (0, fileUploader_1.default)(files, `curriculum-vitae`, 'curriculumVitae');
            userData.curriculumVitae = curriculumVitaePath;
        }
        if (files && files.certificates) {
            const certificatesPath = yield (0, fileUploader_1.default)(files, `certificates`, 'certificates');
            userData.certificates = certificatesPath;
        }
        if (files && files.brandLogo) {
            const brandLogoPath = yield (0, fileUploader_1.default)(files, `brand-logo`, 'brandLogo');
            userData.brandLogo = brandLogoPath;
        }
        if (files && files.image) {
            const imagePath = yield (0, fileUploader_1.default)(files, `image`, 'image');
            userData.image = imagePath;
        }
        const chargePerHour = userData.chargePerHour ? JSON.parse(userData.chargePerHour) : therapistProfile === null || therapistProfile === void 0 ? void 0 : therapistProfile.chargePerHour;
        const availabilities = userData.availabilities ? JSON.parse(userData.availabilities) : therapistProfile === null || therapistProfile === void 0 ? void 0 : therapistProfile.availabilities;
        availabilities.forEach((day) => {
            if (!day.isClosed) {
                day.slotsPerDay = (0, user_utils_1.slotsPerDayOfAvailities)(day);
            }
        });
        userData.availabilities = availabilities;
        userData.chargePerHour = chargePerHour;
        console.log("userData...........", userData);
        updatedProfile = yield therapistProfile_services_1.default.updateTherapistProfileByuserId(id, userData);
    }
    // console.log(userData)
    const updatedUser = yield user_services_1.default.updateSpecificUser(id, userData);
    // console.log(updatedUser, updatedProfile)
    if (!(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.isModified)) {
        throw new errors_1.default.BadRequestError('Failed to update user!');
    }
    if (!(updatedProfile === null || updatedProfile === void 0 ? void 0 : updatedProfile.isModified)) {
        throw new errors_1.default.BadRequestError('Failed to update user profile!');
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: 'success',
        message: 'User modified successfull',
    });
}));
// controller for change profile image of specific user
const changeUserProfileImage = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const files = req.files;
    const { role } = req.user;
    // console.log(files)
    const user = yield user_services_1.default.getSpecificUser(id);
    // console.log(req.files)
    if (!user) {
        throw new errors_1.default.NotFoundError('No user found!');
    }
    let updateUser;
    const userImagePath = yield (0, fileUploader_1.default)(files, `user-image`, 'image');
    if (role === 'patient') {
        updateUser = yield patientProfile_services_1.default.updatePatientProfileByuserId(id, {
            image: userImagePath,
        });
    }
    else if (role === 'therapist') {
        updateUser = yield therapistProfile_services_1.default.updateTherapistProfileByuserId(id, {
            image: userImagePath,
        });
    }
    else {
        throw new errors_1.default.BadRequestError('Invalid role!');
    }
    if (!(updateUser === null || updateUser === void 0 ? void 0 : updateUser.isModified)) {
        throw new errors_1.default.BadRequestError('Failed to change user profile image!');
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: 'success',
        message: 'User profile change successfull',
    });
}));
exports.default = {
    createUser,
    getSpecificUser,
    getAllUser,
    deleteSpecificUser,
    updateSpecificUser,
    changeUserProfileImage,
};
