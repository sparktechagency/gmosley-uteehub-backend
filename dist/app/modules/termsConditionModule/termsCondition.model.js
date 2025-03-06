"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const termsConditionSchema = new mongoose_1.default.Schema({
    termsCondition: String
}, {
    timestamps: true,
});
const TermsCondition = mongoose_1.default.model('termsCondition', termsConditionSchema);
exports.default = TermsCondition;
