"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const termsCondition_controllers_1 = __importDefault(require("./termsCondition.controllers"));
const authorization_1 = __importDefault(require("../../middlewares/authorization"));
const termsConditionRouter = express_1.default.Router();
// Route to create or update Terms and Conditions content (only accessible to admin or super-admin)
termsConditionRouter.post('/create-or-update', (0, authorization_1.default)('super-admin', 'admin'), termsCondition_controllers_1.default.createOrUpdateTermsCondition);
// Route to retrieve Terms and Conditions content (accessible to everyone)
termsConditionRouter.get('/retrive', termsCondition_controllers_1.default.getTermsCondition);
exports.default = termsConditionRouter;
