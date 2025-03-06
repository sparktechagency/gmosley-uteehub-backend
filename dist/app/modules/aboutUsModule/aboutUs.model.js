"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const abountUsSchema = new mongoose_1.default.Schema({
    description: String
}, {
    timestamps: true,
});
const AboutUs = mongoose_1.default.model('aboutUs', abountUsSchema);
exports.default = AboutUs;
