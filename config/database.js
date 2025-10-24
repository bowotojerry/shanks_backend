// Import the Mongoose library, an Object Data Modeling (ODM) library for MongoDB and Node.js.
const mongoose = require("mongoose");
// Import a custom logger utility, likely used for logging events, errors, and information.
const { logger } = require("../src/modules/utils/logger");

// Retrieve the MongoDB connection URL from the environment variables.
const MONGO_URL = process.env.MONGO_URL;

// Start the process of connecting to the MongoDB database.
mongoose
  // Call the connect method with the URL and configuration options.
  .connect(MONGO_URL, {
    // Set a timeout for server selection; Mongoose will try to find a server for 5 seconds before erroring.
    serverSelectionTimeoutMS: 5000,
    // Explicitly specify IP version 4 to be used for connection (some environments require this).
    family: 4, 
  })
  // Handle the successful connection promise.
  .then(() => {
    // Log an informational message indicating the database connection was successful.
    logger.info("database connection successful");
  })
  // Handle any errors that occur during the connection attempt.
  .catch((error) => {
    // Log an error message, including the specific error message from the connection failure.
    logger.error(`Database connection failed: ${error.message}`);
  });

// Export the configured mongoose object, allowing other parts of the application to use it for schema and model creation.
module.exports = mongoose;