// Load environment variables FIRST if we are NOT in production
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express");
const logger = require("./modules/utils/logger");
const morgan = require("morgan");

const app = express();

if (process.env.NODE_ENV === "development") {
     app.use(morgan('dev'));
    //logger.info(`[App] Running in ${process.env.NODE_ENV} mode.`);
}

const APP_PORT = process.env.APP_PORT;
app.listen(APP_PORT, () => {
  logger.info(
    `App is running on port:${APP_PORT}, in ${process.env.NODE_ENV} mode`
  );
});
