"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const adminSchema = new mongoose_1.default.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required!'],
        lowercase: true,
        trim: true,
        validate: {
            validator: (value) => validator_1.default.isEmail(value),
            message: (props) => `${props.value} is not a valid email!`,
        },
    },
    password: {
        type: String,
        trim: true,
        minlength: [8, 'Password must be at least 8 characters'],
        required: [true, 'Password is required!'],
    },
    role: {
        type: String,
        enum: ['super-admin', 'admin'],
        default: 'admin',
    },
    status: {
        type: String,
        enum: ['active', 'blocked', 'disabled'],
        default: 'active',
    },
    verification: {
        code: {
            type: String,
            default: null,
        },
        expireDate: {
            type: Date,
            default: null,
        },
    },
}, {
    timestamps: true,
});
adminSchema.pre('save', function (next) {
    var _a;
    const saltRounds = 10;
    if (this.isModified('password')) {
        this.password = bcrypt_1.default.hashSync(this.password, saltRounds);
    }
    if (this.isModified('verification.code') && ((_a = this.verification) === null || _a === void 0 ? void 0 : _a.code)) {
        this.verification.code = bcrypt_1.default.hashSync(this.verification.code, saltRounds);
    }
    next();
});
adminSchema.methods.comparePassword = function (adminPlanePassword) {
    console.log(adminPlanePassword, this.password);
    return bcrypt_1.default.compareSync(adminPlanePassword, this.password);
};
adminSchema.methods.compareVerificationCode = function (adminPlaneCode) {
    return bcrypt_1.default.compareSync(adminPlaneCode, this.verification.code);
};
const Admin = mongoose_1.default.model('admin', adminSchema);
exports.default = Admin;
