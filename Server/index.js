const express = require('express');
const dotenv = require('dotenv');
const color = require('colors');
const morgan = require('morgan');
const db = require("./config/mongodb");
const cors = require('cors');
const bodyParser= require('body-parser')

dotenv.config()

const app = express();

app.use(cors())
app.use(express.json())
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
app.use(morgan('dev'))
app.use("/", require("./routes"));

const PORT = process.env.PORT || 8000;

app.listen(PORT, ()=> {
    console.log(`Server running: localhost:${PORT}`. green);
})