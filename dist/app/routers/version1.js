"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("../modules/userModule/user.routes"));
const admin_routes_1 = __importDefault(require("../modules/adminModule/admin.routes"));
const auth_routes_1 = __importDefault(require("../modules/authModule/userAuthModule/auth.routes"));
const auth_routes_2 = __importDefault(require("../modules/authModule/adminAuthModule/auth.routes"));
const abountUs_routes_1 = __importDefault(require("../modules/aboutUsModule/abountUs.routes"));
const privacyPolicy_routes_1 = __importDefault(require("../modules/privacyPolicyModule/privacyPolicy.routes"));
const termsCondition_routes_1 = __importDefault(require("../modules/termsConditionModule/termsCondition.routes"));
const slider_routes_1 = __importDefault(require("../modules/sliderModule/slider.routes"));
const routersVersionOne = express_1.default.Router();
// user
routersVersionOne.use('/user', user_routes_1.default);
routersVersionOne.use('/admin', admin_routes_1.default);
// auth
routersVersionOne.use('/user/auth', auth_routes_1.default);
routersVersionOne.use('/admin/auth', auth_routes_2.default);
// settings
routersVersionOne.use('/slider', slider_routes_1.default);
routersVersionOne.use('/about-us', abountUs_routes_1.default);
routersVersionOne.use('/privacy-policy', privacyPolicy_routes_1.default);
routersVersionOne.use('/terms-condition', termsCondition_routes_1.default);
exports.default = routersVersionOne;
