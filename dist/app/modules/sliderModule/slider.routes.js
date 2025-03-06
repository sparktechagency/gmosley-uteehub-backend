"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const slider_controllers_1 = __importDefault(require("./slider.controllers"));
const authorization_1 = __importDefault(require("../../middlewares/authorization"));
const sliderRouter = express_1.default.Router();
sliderRouter.post('/create', (0, authorization_1.default)('super-admin', 'admin'), slider_controllers_1.default.createSlider);
sliderRouter.get('/retrive/all', (0, authorization_1.default)('super-admin', 'admin', 'outlet', 'user'), slider_controllers_1.default.getAllSlider);
sliderRouter.get('/retrive/:id', (0, authorization_1.default)('super-admin', 'admin', 'outlet', 'user'), slider_controllers_1.default.getSpecificSlider);
sliderRouter.patch('/update/:id', (0, authorization_1.default)('super-admin', 'admin'), slider_controllers_1.default.updateSpecificSlider);
sliderRouter.delete('/delete/:id', (0, authorization_1.default)('super-admin', 'admin'), slider_controllers_1.default.deleteSpecificSlider);
exports.default = sliderRouter;
