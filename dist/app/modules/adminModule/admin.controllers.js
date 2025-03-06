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
const admin_services_1 = __importDefault(require("./admin.services"));
const errors_1 = __importDefault(require("../../errors"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const asyncHandler_1 = __importDefault(require("../../../shared/asyncHandler"));
// controller for create new admin
const createAdmin = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminData = req.body;
    const admin = yield admin_services_1.default.createAdmin(adminData);
    if (!admin) {
        throw new errors_1.default.BadRequestError('Failed to create new admin!');
    }
    const _a = admin.toObject(), { password } = _a, adminInfoAcceptPass = __rest(_a, ["password"]);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        status: 'success',
        message: 'Admin creation successfull',
        data: adminInfoAcceptPass,
    });
}));
// controller for get all admin
const getAllAdmin = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admins = yield admin_services_1.default.getAllAdmin();
    const adminsAcceptSuperAdmin = admins.filter((admin) => admin.role !== 'super-admin');
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: 'success',
        message: 'Admin retrive successfull',
        data: adminsAcceptSuperAdmin,
    });
}));
// controller for get specific admin
const getSpecificAdmin = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const admin = yield admin_services_1.default.getSpecificAdmin(id);
    if (!admin) {
        throw new errors_1.default.NotFoundError('No admin found!');
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: 'success',
        message: 'Admin found successfull',
        data: admin,
    });
}));
// controller for update specific admin
const updateSpecificAdmin = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const data = req.body;
    if (data.password || data.email) {
        throw new errors_1.default.BadRequestError("You can't update adminId, email, password directly!");
    }
    const updatedAdmin = yield admin_services_1.default.updateSpecificAdmin(id, data);
    if (!updatedAdmin.modifiedCount) {
        throw new errors_1.default.BadRequestError('Failed to update Admin!');
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: 'success',
        message: 'Admin update successfull',
    });
}));
// controller for delete specific admin
const deleteSpecificAdmin = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const admin = yield admin_services_1.default.deleteSpecificAdmin(id);
    if (!admin.deletedCount) {
        throw new errors_1.default.BadRequestError('Failed to delete admin!');
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: 'success',
        message: 'Admin delete successfull',
    });
}));
exports.default = {
    createAdmin,
    getAllAdmin,
    getSpecificAdmin,
    updateSpecificAdmin,
    deleteSpecificAdmin,
};
