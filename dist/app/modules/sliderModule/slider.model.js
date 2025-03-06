"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const sliderSchema = new mongoose_1.default.Schema({
    title: String,
    image: String
}, {
    timestamps: true,
});
const Slider = mongoose_1.default.model('slider', sliderSchema);
exports.default = Slider;
