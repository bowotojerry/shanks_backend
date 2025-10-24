// Load environment variables FIRST if we are NOT in production
// Conditional check: If the application environment is NOT "production"...
if (process.env.NODE_ENV !== "production") {
  // ...require and load environment variables from a .env file using the dotenv library.
  require("dotenv").config();
}
// Import the configured Express application instance from its respective file.
const app = require('../src/app');
// Import the configured Mongoose instance (which handles the database connection) from the database config file.
const mongoose = require('../config/database');
// Destructure and import the custom 'logger' and 'morganStream' from the logging utility file.
const { logger, morganStream } = require("../src/modules/utils/logger");


// health check for route
// Define a GET route for a health check endpoint.
app.get("/api/v1/health", (req, res) => {
  // Record the high-resolution start time of processing the request (used for calculating response time).
  const start = process.hrtime(); 

  // Send a JSON response with status information.
  res.json({
    // General status of the application.
    status: "OK",
    // Check the MongoDB connection state: 1 means connected, otherwise disconnected.
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    // Report the application's uptime in seconds since it started.
    uptime: process.uptime(),
    // Provide the current server time in ISO 8601 format.
    timestamp: new Date().toISOString(),
    // Calculate and report the response time in nanoseconds by comparing the current time with the start time.
    responseTime: process.hrtime(start)[1] // Convert nanoseconds to milliseconds
  });
});

// Retrieve the application port from environment variables, defaulting to 3000 if not set.
const APP_PORT = process.env.APP_PORT || 3000;

// Start the Express server, listening on the specified port.
app.listen(APP_PORT, () => {
  // Use the custom logger to record that the server has successfully started.
  logger.info(
    // Log the port number and the current environment mode.
    `App is running on port:${APP_PORT}, in ${process.env.NODE_ENV} mode`
  );
});