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
const therapistProfile_model_1 = __importDefault(require("./therapistProfile.model"));
// service for create therapist profile
const createTherapistProfile = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield therapistProfile_model_1.default.create(data);
});
// service for retrive specific therapist profile by user
const getTherapistProfileByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield therapistProfile_model_1.default.findOne({ user: userId });
});
// service for update therapist profile
const updateTherapistProfileByuserId = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield therapistProfile_model_1.default.findOneAndUpdate({ user: userId }, data);
});
// service for delete therapist profile
const deleteTherapistProfileByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield therapistProfile_model_1.default.findOneAndDelete({ user: userId });
});
exports.default = {
    createTherapistProfile,
    getTherapistProfileByUserId,
    updateTherapistProfileByuserId,
    deleteTherapistProfileByUserId
};
