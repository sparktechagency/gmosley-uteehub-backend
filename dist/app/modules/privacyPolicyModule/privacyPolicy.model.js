"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const privacyPolicySchema = new mongoose_1.default.Schema({
    privacyPolicy: String,
}, {
    timestamps: true,
});
const PrivacyPolicy = mongoose_1.default.model('privacyPolicy', privacyPolicySchema);
exports.default = PrivacyPolicy;
