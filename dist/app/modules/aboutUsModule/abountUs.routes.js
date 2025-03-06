"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aboutUs_controllers_1 = __importDefault(require("./aboutUs.controllers"));
const authorization_1 = __importDefault(require("../../middlewares/authorization"));
const aboutUsRouter = express_1.default.Router();
// Route to create or update About Us content (only accessible to admin or super-admin)
aboutUsRouter.post('/create-or-update', (0, authorization_1.default)('super-admin', 'admin'), aboutUs_controllers_1.default.createOrUpdateAboutUs);
// Route to retrieve About Us content (accessible to everyone)
aboutUsRouter.get('/retrive', aboutUs_controllers_1.default.getAboutUs);
exports.default = aboutUsRouter;
