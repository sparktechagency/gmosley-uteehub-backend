"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controllers_1 = __importDefault(require("./auth.controllers"));
const adminAuthRouter = express_1.default.Router();
adminAuthRouter.post('/login', auth_controllers_1.default.adminLogin);
adminAuthRouter.post('/forget-password/send-otp', auth_controllers_1.default.sendOTP);
adminAuthRouter.post('/verify-otp', auth_controllers_1.default.verifyOTP);
adminAuthRouter.post('/reset-password', auth_controllers_1.default.resetPassword);
adminAuthRouter.post('/change-password', auth_controllers_1.default.changePassword);
exports.default = adminAuthRouter;
