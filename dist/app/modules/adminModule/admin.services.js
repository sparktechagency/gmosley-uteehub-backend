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
const admin_model_1 = __importDefault(require("./admin.model"));
// service for create new admin
const createAdmin = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield admin_model_1.default.create(data);
});
// service for get all admin
const getAllAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield admin_model_1.default.find().select('-password');
});
// service for get specific admin
const getSpecificAdmin = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield admin_model_1.default.findOne({ _id: id }).select('-password');
});
// service for get specific admin by email
const getAdminByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield admin_model_1.default.findOne({ email });
});
// service for update specific admin
const updateSpecificAdmin = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(data);
    return yield admin_model_1.default.updateOne({ _id: id }, data, {
        runValidators: true,
    });
});
// service for delete specific admin
const deleteSpecificAdmin = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield admin_model_1.default.deleteOne({ _id: id });
});
exports.default = {
    createAdmin,
    getAllAdmin,
    getSpecificAdmin,
    getAdminByEmail,
    updateSpecificAdmin,
    deleteSpecificAdmin
};
