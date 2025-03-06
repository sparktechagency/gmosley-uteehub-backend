"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const therapistProfileSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user',
    },
    specialty: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'speciality',
        required: true,
    },
    subSpecialty: {
        type: String,
        required: true,
    },
    professionalSummary: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    curriculumVitae: {
        type: String,
        required: true,
    },
    certificates: [
        {
            type: String,
            required: true,
        },
    ],
    brandLogo: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    availabilities: [
        {
            dayName: String,
            dayIndex: Number,
            startTime: String,
            endTime: String,
            appointmentLimit: Number,
            slotsPerDay: [String],
            isClosed: Boolean,
        },
    ],
    chargePerHour: {
        amount: {
            type: Number,
            default: 0,
        },
        currency: {
            type: String,
            enum: ['USD'],
            default: 'USD',
        },
    },
}, {
    timestamps: true,
});
const TherapistProfile = mongoose_1.default.model('therapist', therapistProfileSchema);
exports.default = TherapistProfile;
