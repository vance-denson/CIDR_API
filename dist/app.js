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
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = exports.app = void 0;
//MAIN - DB CONNECTION REQUIRED BEFORE LISTEN
// import express, {Application, Request, Response, NextFunction} from 'express';
const express = require('express');
exports.app = express();
const routes = require('./routes/addresses');
const connectMongoose_1 = require("./db/connectMongoose");
require('dotenv').config();
let port = process.env.DEV_PORT || 3001;
exports.app.use(express.json());
exports.app.use('/api/cidr', routes);
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connectMongoose_1.dbConnect)(process.env.MONGOOSE_URI);
        exports.app.listen(port, console.log(`App running on localhost:${port}...`));
    }
    catch (error) {
        console.error(error);
    }
});
exports.startServer = startServer;
(0, exports.startServer)();
