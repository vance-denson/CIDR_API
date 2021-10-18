//MAIN - DB CONNECTION REQUIRED BEFORE LISTEN

const express = require('express');
const app = express();
const addresses = require('./routes/addresses');
const dbConnect = require('./db/connectMongoose');
require('dotenv').config();
port = process.env.DEV_PORT;

app.use(express.json());
app.use('/api/cidr', addresses);

const startServer = async () => {
  try {
    await dbConnect(process.env.MONGOOSE_URI);
    app.listen(port, console.log(`App running on localhost:${port}...`));
  } catch (e) {
    console.log(e);
  }
};

startServer();
