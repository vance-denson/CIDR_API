//MAIN - DB CONNECTION REQUIRED BEFORE LISTEN
const express = require('express');
const app = express();
const addresses = require('./routes/addresses');
import { dbConnect } from './db/connectMongoose';
require('dotenv').config();
let port = process.env.DEV_PORT;

app.use(express.json());
app.use('/api/cidr', addresses);

interface db {
  dbConnection: string;
}

const startServer = async () => {
  try {
    await dbConnect(<db['dbConnection']>process.env.MONGOOSE_URI);
    app.listen(port, console.log(`App running on localhost:${port}...`));
  } catch (error) {
    console.error(error);
  }
};

startServer();
