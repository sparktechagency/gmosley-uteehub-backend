"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = require("http-status-codes");
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./config"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const path_1 = __importDefault(require("path"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const routers_1 = __importDefault(require("./app/routers"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const morgan_1 = require("./config/morgan");
const errors_1 = __importDefault(require("./app/errors"));
const app = (0, express_1.default)();
// global middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
if (config_1.default.node_env !== 'test') {
    app.use(morgan_1.successHandler);
    app.use(morgan_1.errorHandler);
}
app.use((0, cookie_parser_1.default)());
app.use((0, express_fileupload_1.default)());
app.use('/v1/uploads', express_1.default.static(path_1.default.join('uploads')));
const limiter = (0, express_rate_limit_1.default)({
    max: 150,
    windowMs: 15 * 60 * 1000,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: 'Too many request found from your IP. Please try again after 15 minutes.',
});
// app.use(limiter);
// application middleware
app.use('/', routers_1.default);
app.get('/health_check', (req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).json({
        message: 'Welcome to the server. Server health is good.',
    });
});
// Example error logging
app.get('/error', (req, res, next) => {
    next(new errors_1.default.BadRequestError('Testin error'));
});
app.get('/favicon.ico', (req, res) => {
    res.status(204).end(); // No Content
});
// Error handling middlewares
app.use(globalErrorHandler_1.default);
app.use(notFound_1.default);
exports.default = app;
