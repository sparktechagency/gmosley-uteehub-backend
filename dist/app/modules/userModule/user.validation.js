"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
// Shared validation for gender and role enums
const genderEnum = zod_1.default.enum(['male', 'female', 'other'], {
    required_error: 'Gender is required!',
    invalid_type_error: 'Invalid gender type. Allowed values are male, female, or other.',
});
const roleEnum = zod_1.default.enum(['patient', 'therapist'], {
    required_error: 'Role is required!',
    invalid_type_error: 'Invalid role type. Allowed values are patient or therapist.',
});
// Combined validation schema for user and profile
const createUserWithProfileZodSchema = zod_1.default.object({
    body: zod_1.default.object({
        // User fields
        firstName: zod_1.default
            .string({
            required_error: 'First name is required!',
        })
            .min(1, 'First name must not be empty!'),
        lastName: zod_1.default
            .string({
            required_error: 'Last name is required!',
        })
            .min(1, 'Last name must not be empty!'),
        email: zod_1.default
            .string({
            required_error: 'Email is required!',
        })
            .email('Invalid email address!'),
        password: zod_1.default
            .string({
            required_error: 'Password is required!',
        })
            .min(8, 'Password must be at least 8 characters!'),
        phone: zod_1.default
            .string({
            required_error: 'Phone number is required!',
        })
            .min(10, 'Phone number must be at least 10 digits!')
            .regex(/^\d+$/, 'Phone number must only contain digits!'),
        role: roleEnum,
        isSocial: zod_1.default.boolean().optional(),
        isEmailVerified: zod_1.default.boolean().optional(),
        fcmToken: zod_1.default.string().nullable().optional(),
        verification: zod_1.default
            .object({
            code: zod_1.default.string().nullable().optional(),
            expireDate: zod_1.default.date().nullable().optional(),
        })
            .optional(),
        // Profile fields
        profile: zod_1.default
            .object({
            // Patient-specific fields
            address: zod_1.default.string().optional(),
            dateOfBirth: zod_1.default
                .string()
                .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be in YYYY-MM-DD format!')
                .optional(),
            gender: genderEnum.optional(),
            image: zod_1.default.string().optional(),
            // Therapist-specific fields
            specialty: zod_1.default.string().optional(),
            subSpecialty: zod_1.default.string().optional(),
            professionalSummary: zod_1.default.string().optional(),
            experience: zod_1.default.string().optional(),
            curriculumVitae: zod_1.default.string().optional(),
            certificates: zod_1.default.array(zod_1.default.string()).optional(),
            brandLogo: zod_1.default.string().optional(),
        })
            .partial()
            .refine((data) => {
            // Ensure required profile fields based on role
            if (data.specialty || data.subSpecialty || data.professionalSummary) {
                return data.specialty && data.subSpecialty && data.professionalSummary;
            }
            return true;
        }, {
            message: 'Therapist profile requires specialty, subSpecialty, and professionalSummary!',
        })
            .optional(),
    }),
});
const getSpecificUserZodSchema = zod_1.default.object({
    params: zod_1.default.object({
        id: zod_1.default.string({
            required_error: 'id is missing in request params!',
        }),
    }),
});
const UserValidationZodSchema = {
    createUserWithProfileZodSchema,
    getSpecificUserZodSchema,
};
exports.default = UserValidationZodSchema;
