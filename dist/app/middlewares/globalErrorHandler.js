"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const devErrorResponse = (error, res) => {
    return res.status(error.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: error.message,
        errorTrace: error.stack,
    });
};
const prodErrorResponse = (error, res) => {
    return res.status(error.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: error.message,
    });
};
const globalErrorHandler = (err, req, res, next) => {
    var _a, _b;
    err.statusCode = err.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    err.message = err.message || 'Something went wrong, try again later';
    res.locals.errorMessage = err.message;
    // Handle Mongoose ValidationError
    if (err.name === 'ValidationError' && err.errors) {
        err.message = Object.values(err.errors)
            .map((item) => item.message)
            .join(',');
        err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
    }
    // console.log("error here", err)
    // Handle Mongoose Duplicate Key Error (code 11000)
    if (err.code && err.code === 11000) {
        err.message = `${Object.keys(err.keyValue || {}).join(', ')} already exists!`;
        err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST; // 400
    }
    // Development vs Production Response
    if (((_a = process.env.NODE_ENV) === null || _a === void 0 ? void 0 : _a.trim()) === 'development') {
        devErrorResponse(err, res);
    }
    else if (((_b = process.env.NODE_ENV) === null || _b === void 0 ? void 0 : _b.trim()) === 'production') {
        prodErrorResponse(err, res);
    }
    else {
        prodErrorResponse(err, res);
    }
};
exports.default = globalErrorHandler;
