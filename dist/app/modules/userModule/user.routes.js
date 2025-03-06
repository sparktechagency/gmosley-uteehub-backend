"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controllers_1 = __importDefault(require("./user.controllers"));
const user_validation_1 = __importDefault(require("./user.validation"));
const requestValidator_1 = __importDefault(require("../../middlewares/requestValidator"));
const authorization_1 = __importDefault(require("../../middlewares/authorization"));
const userRouter = express_1.default.Router();
userRouter.post('/create', (0, requestValidator_1.default)(user_validation_1.default.createUserWithProfileZodSchema), user_controllers_1.default.createUser);
userRouter.get('/retrive/all', user_controllers_1.default.getAllUser);
userRouter.get('/retrive/:id', (0, requestValidator_1.default)(user_validation_1.default.getSpecificUserZodSchema), user_controllers_1.default.getSpecificUser);
userRouter.patch('/update/:id', (0, authorization_1.default)('patient', 'therapist'), (0, requestValidator_1.default)(user_validation_1.default.getSpecificUserZodSchema), user_controllers_1.default.updateSpecificUser);
userRouter.delete('/delete/:id', (0, authorization_1.default)('patient', 'therapist'), (0, requestValidator_1.default)(user_validation_1.default.getSpecificUserZodSchema), user_controllers_1.default.deleteSpecificUser);
userRouter.patch('/update/profile-picture/:id', (0, authorization_1.default)('patient', 'therapist'), (0, requestValidator_1.default)(user_validation_1.default.getSpecificUserZodSchema), user_controllers_1.default.changeUserProfileImage);
exports.default = userRouter;
