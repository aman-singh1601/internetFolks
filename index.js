const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes');
const {MongoDbConnect} = require('./connection.js');

const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;


const app = express();

app.use(express.urlencoded({extended: false}));
app.use(cors());

MongoDbConnect(DB_URL);

app.use("/", routes);


app.listen(PORT, () => {
    console.log(`API Server running on port ${PORT}`);
})