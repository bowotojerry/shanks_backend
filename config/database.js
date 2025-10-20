const mongoose = require("mongoose");
const { logger } = require("../src/modules/utils/logger");

const MONGO_URL = process.env.MONGO_URL;

mongoose
  .connect(MONGO_URL, {
  serverSelectionTimeoutMS: 5000,
  family: 4, 
})
  .then(() => {
    logger.info("database connection successful");
  })
  .catch((error) => {
    logger.error(`Database connection failed: ${error.message}`);
  });

module.exports = mongoose;
