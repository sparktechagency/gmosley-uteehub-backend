"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const version1_1 = __importDefault(require("./version1"));
const routers = express_1.default.Router();
routers.use('/v1', version1_1.default);
exports.default = routers;
