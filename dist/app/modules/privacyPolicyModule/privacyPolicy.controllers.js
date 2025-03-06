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
const privacyPolicy_model_1 = __importDefault(require("./privacyPolicy.model"));
const errors_1 = __importDefault(require("../../errors"));
const http_status_codes_1 = require("http-status-codes");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const asyncHandler_1 = __importDefault(require("../../../shared/asyncHandler"));
// Controller to create or update Privacy Policy content
const createOrUpdatePrivacyPolicy = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { privacyPolicy } = req.body;
    // Check if Privacy Policy exists; if it does, update, otherwise create
    const existingPrivacyPolicy = yield privacyPolicy_model_1.default.findOne();
    if (existingPrivacyPolicy) {
        // Update the existing Privacy Policy record
        const updatedPrivacyPolicy = yield privacyPolicy_model_1.default.updateOne({ _id: existingPrivacyPolicy._id }, { privacyPolicy }, { runValidators: true });
        if (!updatedPrivacyPolicy.modifiedCount) {
            throw new errors_1.default.BadRequestError('Failed to update Privacy Policy');
        }
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            status: 'success',
            message: 'Privacy Policy updated successfully',
        });
    }
    else {
        // Create a new Privacy Policy record
        const newPrivacyPolicy = yield privacyPolicy_model_1.default.create({ privacyPolicy });
        if (!newPrivacyPolicy) {
            throw new errors_1.default.BadRequestError('Failed to create Privacy Policy');
        }
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.CREATED,
            status: 'success',
            message: 'Privacy Policy created successfully',
        });
    }
}));
// Controller to get Privacy Policy content
const getPrivacyPolicy = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const privacyPolicy = yield privacyPolicy_model_1.default.findOne();
    if (!privacyPolicy) {
        throw new errors_1.default.NotFoundError('No Privacy Policy found!');
    }
    return (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: 'success',
        message: 'Privacy Policy content retrieved successfully',
        data: privacyPolicy,
    });
}));
exports.default = {
    createOrUpdatePrivacyPolicy,
    getPrivacyPolicy,
};
