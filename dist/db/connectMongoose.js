"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dbConnect = (credentials) => {
    try {
        mongoose_1.default.connect(credentials, {}, () => {
            // return console.info(`Successful connection to ${credentials}`);
            // console.info('Server Started...');
        });
    }
    catch (error) {
        console.error('Error connecting to database: ', error);
        return;
    }
};
exports.dbConnect = dbConnect;
