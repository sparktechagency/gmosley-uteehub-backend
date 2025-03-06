"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controllers_1 = __importDefault(require("./admin.controllers"));
const authorization_1 = __importDefault(require("../../middlewares/authorization"));
const adminRouter = express_1.default.Router();
adminRouter.post('/create', admin_controllers_1.default.createAdmin);
adminRouter.get('/retrive/all', admin_controllers_1.default.getAllAdmin);
adminRouter.get('/retrive/:id', admin_controllers_1.default.getSpecificAdmin);
adminRouter.patch('/update/:id', (0, authorization_1.default)('super-admin', 'admin'), admin_controllers_1.default.updateSpecificAdmin);
adminRouter.delete('/delete/:id', (0, authorization_1.default)('super-admin'), admin_controllers_1.default.deleteSpecificAdmin);
exports.default = adminRouter;
