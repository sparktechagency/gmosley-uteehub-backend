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
const fileUploader_1 = __importDefault(require("../../../utils/fileUploader"));
const slider_model_1 = __importDefault(require("./slider.model"));
const errors_1 = __importDefault(require("../../errors"));
const http_status_codes_1 = require("http-status-codes");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
// controller for create new slider
const createSlider = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sliderData = req.body;
    const sliderImagePath = yield (0, fileUploader_1.default)(req.files, `slider-image`, 'image');
    sliderData.image = sliderImagePath;
    const slider = yield slider_model_1.default.create(sliderData);
    if (!slider) {
        throw new errors_1.default.BadRequestError('Failed to create slider!');
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        status: 'success',
        message: 'slider image create successfull',
    });
});
const getAllSlider = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sliders = yield slider_model_1.default.find();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: 'success',
        message: 'slider images retrive successfull',
        data: sliders,
    });
});
const getSpecificSlider = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        throw new errors_1.default.BadRequestError('Missing id in request params!');
    }
    const slider = yield slider_model_1.default.findOne({ _id: id });
    if (!slider) {
        throw new errors_1.default.NotFoundError('No slider found!');
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: 'success',
        message: 'slider images retrive successfull',
        data: slider,
    });
});
const updateSpecificSlider = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const files = req.files;
    if (!id) {
        throw new errors_1.default.BadRequestError('Missing id in request params!');
    }
    if (files) {
        const sliderImagePath = yield (0, fileUploader_1.default)(req.files, `slider-image`, 'image');
        req.body.image = sliderImagePath;
    }
    const updatedSlider = yield slider_model_1.default.updateOne({ _id: id }, req.body, {
        runValidators: true,
    });
    if (!updatedSlider.modifiedCount) {
        throw new errors_1.default.BadRequestError('Failed to update slider');
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: 'success',
        message: 'slider update successfull',
    });
});
const deleteSpecificSlider = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        throw new errors_1.default.BadRequestError('Missing id in request params!');
    }
    const deletedSlider = yield slider_model_1.default.deleteOne({ _id: id });
    if (!deletedSlider.deletedCount) {
        throw new errors_1.default.BadRequestError('Failed to delete slider');
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: 'success',
        message: 'slider delete successfull',
    });
});
exports.default = {
    createSlider,
    getAllSlider,
    getSpecificSlider,
    updateSpecificSlider,
    deleteSpecificSlider,
};
