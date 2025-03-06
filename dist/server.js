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
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config"));
const app_1 = __importDefault(require("./app"));
let server;
// handle uncaught exception error
process.on('uncaughtException', (error) => {
    console.log('uncaughtException error', error);
    process.exit(1);
});
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(config_1.default.mongodb_url);
    console.log('\x1b[36mDatabase connection successfull\x1b[0m');
    server = app_1.default.listen(config_1.default.server_port || 5002, () => {
        console.log(`\x1b[32mServer is listening on port ${config_1.default.server_port || 5002}\x1b[0m`);
    });
});
// handle unhandled rejection
process.on('unhandledRejection', (reason, promise) => {
    console.log(`unhandle rejection at ${promise} and reason ${reason}`);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
// gracefull shoutdown on SIGTERM
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received.');
    server.close(() => {
        console.log('Server closed.');
    });
});
startServer();
