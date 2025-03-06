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
const user_model_1 = __importDefault(require("./user.model"));
const patientProfile_model_1 = __importDefault(require("../profileModule/patientProfile/patientProfile.model"));
const therapistProfile_model_1 = __importDefault(require("../profileModule/therapistProfile/therapistProfile.model"));
// service for create new user
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.default.create(data);
});
// service for get specific user
const getSpecificUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.default.findOne({ _id: id })
        .populate({
        path: 'profile',
        select: '',
    })
        .select('-password');
});
// service for get specific user
const getAllUser = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.default.find()
        .populate({
        path: 'profile',
        select: '',
    })
        .select('-password');
});
// service for get specific user
const getSpecificUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.default.findOne({ email })
        .populate({
        path: 'profile',
        select: '',
    })
        .select('-password');
});
// service for update specific user
const updateSpecificUser = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.default.findOneAndUpdate({ _id: id }, data);
});
// service for delete specific user
const deleteSpecificUser = (id, role) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_model_1.default.deleteOne({ _id: id });
    if (role === 'patient') {
        yield patientProfile_model_1.default.deleteOne({ user: id });
    }
    else if (role === 'therapist') {
        yield therapistProfile_model_1.default.deleteOne({ user: id });
    }
    else {
        return false;
    }
    return true;
});
exports.default = {
    createUser,
    getSpecificUser,
    getSpecificUserByEmail,
    updateSpecificUser,
    deleteSpecificUser,
    getAllUser,
};
