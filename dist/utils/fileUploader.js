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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const errors_1 = __importDefault(require("../app/errors"));
const fileUploader = (files, directory, imageName) => __awaiter(void 0, void 0, void 0, function* () {
    // check the file
    if (!files || Object.keys(files).length === 0) {
        throw new errors_1.default.NotFoundError('No files were uploaded!');
    }
    const folderPath = path_1.default.join('uploads', directory);
    // Ensure the directory exists, if not, create it
    if (!fs_1.default.existsSync(folderPath)) {
        fs_1.default.mkdirSync(folderPath, { recursive: true });
    }
    // check one image or two image
    if (!Array.isArray(files[imageName])) {
        const file = files[imageName];
        const fileName = file.name;
        const filePath = path_1.default.join(folderPath, fileName);
        yield file.mv(filePath);
        return filePath;
    }
    else if (files[imageName].length > 0) {
        // Handle multiple file uploads
        const filePaths = [];
        for (const item of files[imageName]) {
            const fileName = item.name;
            const filePath = path_1.default.join(folderPath, fileName);
            yield item.mv(filePath);
            filePaths.push(filePath); // Collect all file paths
        }
        return filePaths;
    }
    else {
        throw new errors_1.default.BadRequestError('Invalid file format!');
    }
});
exports.default = fileUploader;
