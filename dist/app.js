"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//MAIN - DB CONNECTION REQUIRED BEFORE LISTEN
const express = require('express');
const app = express();
const addresses = require('./routes/addresses');
const connectMongoose_1 = require("./db/connectMongoose");
require('dotenv').config();
let port = process.env.DEV_PORT;
app.use(express.json());
app.use('/api/cidr', addresses);
const startServer = async () => {
    try {
        await (0, connectMongoose_1.dbConnect)(process.env.MONGOOSE_URI);
        app.listen(port, console.log(`App running on localhost:${port}...`));
    }
    catch (error) {
        console.error(error);
    }
};
startServer();
