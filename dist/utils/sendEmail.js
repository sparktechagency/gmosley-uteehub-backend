"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const errors_1 = __importDefault(require("../app/errors"));
// Define the sendMail function
const sendMail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ from, to, subject, text }) {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: config_1.default.gmail_app_user,
                pass: config_1.default.gmail_app_password,
            },
        });
        const mailOptions = {
            from,
            to,
            subject,
            text,
        };
        // Wait for the sendMail operation to complete
        const info = yield transporter.sendMail(mailOptions);
        // console.log('Message sent: %s', info.messageId);
        return true;
    }
    catch (error) {
        throw new errors_1.default.BadRequestError('Failed to send mail!');
        // console.error('Error sending mail: ', error);
        // return false;
    }
});
exports.default = sendMail;
