"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createToken = (payload, setret, expiresTime) => {
    return jsonwebtoken_1.default.sign(payload, setret, {
        expiresIn: expiresTime
    });
};
const verifyToken = (token, secret) => {
    return jsonwebtoken_1.default.verify(token, secret);
};
const jwtHelpers = {
    createToken,
    verifyToken,
};
exports.default = jwtHelpers;
