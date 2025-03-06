"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const privacyPolicy_controllers_1 = __importDefault(require("./privacyPolicy.controllers"));
const authorization_1 = __importDefault(require("../../middlewares/authorization"));
const privacyPolicyRouter = express_1.default.Router();
// Route to create or update Privacy Policy content (only accessible to admin or super-admin)
privacyPolicyRouter.post('/create-or-update', (0, authorization_1.default)('super-admin', 'admin'), privacyPolicy_controllers_1.default.createOrUpdatePrivacyPolicy);
// Route to retrieve Privacy Policy content (accessible to everyone)
privacyPolicyRouter.get('/retrive', privacyPolicy_controllers_1.default.getPrivacyPolicy);
exports.default = privacyPolicyRouter;
