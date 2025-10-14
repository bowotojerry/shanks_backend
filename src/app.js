const express = require("express");
require("dotenv").config();
const logger = require('./modules/utils/logger');

const app = express();

const APP_PORT = process.env.APP_PORT;
app.listen(APP_PORT, () => {
  logger.info(`App is running on port:${APP_PORT}`);
});
