const express = require('express')
require('dotenv').config();
const logger = require('winston')

const app = express();

const APP_PORT = process.env.APP_PORT
app.listen(APP_PORT, () => {
logger.info()
})
