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
const termsCondition_model_1 = __importDefault(require("./termsCondition.model"));
const errors_1 = __importDefault(require("../../errors"));
const http_status_codes_1 = require("http-status-codes");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const asyncHandler_1 = __importDefault(require("../../../shared/asyncHandler"));
// Controller to create or update Terms and Conditions content
const createOrUpdateTermsCondition = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { termsCondition } = req.body;
    // Check if Terms and Conditions content exists; if it does, update, otherwise create
    const existingTermsCondition = yield termsCondition_model_1.default.findOne();
    if (existingTermsCondition) {
        // Update the existing Terms and Conditions record
        const updatedTermsCondition = yield termsCondition_model_1.default.updateOne({ _id: existingTermsCondition._id }, { termsCondition }, { runValidators: true });
        if (!updatedTermsCondition.modifiedCount) {
            throw new errors_1.default.BadRequestError('Failed to update Terms and Conditions');
        }
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            status: 'success',
            message: 'Terms and Conditions updated successfully',
        });
    }
    else {
        // Create a new Terms and Conditions record
        const newTermsCondition = yield termsCondition_model_1.default.create({ termsCondition });
        if (!newTermsCondition) {
            throw new errors_1.default.BadRequestError('Failed to create Terms and Conditions');
        }
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.CREATED,
            status: 'success',
            message: 'Terms and Conditions created successfully',
        });
    }
}));
// Controller to get Terms and Conditions content
const getTermsCondition = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const termsCondition = yield termsCondition_model_1.default.findOne();
    if (!termsCondition) {
        throw new errors_1.default.NotFoundError('No Terms and Conditions found!');
    }
    return (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: 'success',
        message: 'Terms and Conditions content retrieved successfully',
        data: termsCondition,
    });
}));
exports.default = {
    createOrUpdateTermsCondition,
    getTermsCondition,
};
