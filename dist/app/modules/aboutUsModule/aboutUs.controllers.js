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
const aboutUs_model_1 = __importDefault(require("./aboutUs.model"));
const errors_1 = __importDefault(require("../../errors"));
const http_status_codes_1 = require("http-status-codes");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const asyncHandler_1 = __importDefault(require("../../../shared/asyncHandler"));
// Controller to create or update About Us content
const createOrUpdateAboutUs = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { description } = req.body;
    // Check if About Us exists; if it does, update, otherwise create
    const existingAboutUs = yield aboutUs_model_1.default.findOne();
    if (existingAboutUs) {
        // Update the existing About Us record
        const updatedAboutUs = yield aboutUs_model_1.default.updateOne({ _id: existingAboutUs._id }, { description }, { runValidators: true });
        if (!updatedAboutUs.modifiedCount) {
            throw new errors_1.default.BadRequestError('Failed to update About Us');
        }
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            status: 'success',
            message: 'About Us updated successfully',
        });
    }
    else {
        // Create a new About Us record
        const newAboutUs = yield aboutUs_model_1.default.create({ description });
        if (!newAboutUs) {
            throw new errors_1.default.BadRequestError('Failed to create About Us');
        }
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.CREATED,
            status: 'success',
            message: 'About Us created successfully',
        });
    }
}));
// Controller to get About Us content
const getAboutUs = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const aboutUs = yield aboutUs_model_1.default.findOne();
    if (!aboutUs) {
        throw new errors_1.default.NotFoundError('No About Us found!');
    }
    return (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: 'success',
        message: 'About Us content retrieved successfully',
        data: aboutUs,
    });
}));
exports.default = {
    createOrUpdateAboutUs,
    getAboutUs,
};
