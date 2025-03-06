"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const requestValidator = (schema) => {
    return (req, res, next) => {
        var _a;
        const result = schema.safeParse({
            body: req.body,
            query: req.query,
            params: req.params,
            cookies: req.cookies,
        });
        if (!result.success) {
            (0, sendResponse_1.default)(res, {
                statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                status: 'failed',
                message: 'Request validation error!',
                data: ((_a = result.error) === null || _a === void 0 ? void 0 : _a.errors) || [],
            });
            return;
        }
        return next();
    };
};
exports.default = requestValidator;
