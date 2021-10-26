//MAIN - DB CONNECTION REQUIRED BEFORE LISTEN
// import express, {Application, Request, Response, NextFunction} from 'express';
const express = require('express');
export const app = express();
const routes = require('./routes/addresses');
import { dbConnect } from './db/connectMongoose';
require('dotenv').config();
let port = process.env.DEV_PORT || 3001;

app.use(express.json());
app.use('/api/cidr', routes);

interface db {
  dbConnection: string;
}

export const startServer = async () => {
  try {
    await dbConnect(<db['dbConnection']>process.env.MONGOOSE_URI);
    app.listen(port, console.log(`App running on localhost:${port}...`));
  } catch (error) {
    console.error(error);
  }
};

startServer();
