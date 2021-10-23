"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// type uriInput = {
//   db: string | undefined;
// };
const dbConnect = (db) => {
    try {
        mongoose_1.default.connect(db, {}, () => {
            return console.info(`Successful connection to ${db}`);
        });
    }
    catch (error) {
        console.error('Error connecting to database: ', error);
        return;
    }
    console.log('Mongoose Connected!');
    return mongoose_1.default.connect(db);
};
exports.dbConnect = dbConnect;
