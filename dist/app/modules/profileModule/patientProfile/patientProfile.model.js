"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const patientProfileSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user',
    },
    address: String,
    dateOfBirth: String,
    gender: {
        type: String,
        enum: {
            values: ['male', 'female', 'other'],
            message: '{VALUE} is not accepted as gender. Please use male/female or other'
        }
    },
    image: String,
}, {
    timestamps: true
});
const PatientProfile = mongoose_1.default.model('patient', patientProfileSchema);
exports.default = PatientProfile;
