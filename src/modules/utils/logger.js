// Destructure and import necessary components (createLogger, format, transports) from the winston logging library.
const { createLogger, format, transports } = require("winston");
// Import the morgan middleware, often used for HTTP request logging in Express.js.
const morgan = require("morgan");

// Determine the current environment from environment variables, defaulting to "development".
const NODE_ENV = process.env.NODE_ENV || "development";
// A boolean flag to quickly check if the environment is production.
const isProduction = NODE_ENV === "production";

// Define Log Levels

// Set the base log level: "info" in production (less verbose), "debug" in development (more verbose).
const logLevel = isProduction ? "info" : "debug";

// Custom Format (Filtering)

// Define a custom format function using winston's format API to filter and mask sensitive information.
const filterSensitiveInfo = format((info) => {
  // If the log object contains a 'password' property, mask its value with "****".
  if (info.password) info.password = "****";
  // If the log object contains an 'apiKey' property, completely remove it from the log.
  if (info.apiKey) delete info.apiKey;
  // Check if the log message exists and is a string.
  if (info.message && typeof info.message === "string") {
    // Use a regular expression to find and replace 16-digit number patterns (like credit card numbers) with masks.
    info.message = info.message.replace(
      /\d{4}-\d{4}-\d{4}-\d{4}/g,
      "****-****-****-****"
    );
  }
  // Check for an 'error' object nested within the log object.
  if (info.error && typeof info.error === "object") {
    // Apply masking/deletion rules to properties within the nested error object as well.
    if (info.error.password) info.error.password = "****";
    if (info.error.apiKey) delete info.error.apiKey;
  }
  // Return the modified log information object.
  return info;
});

// Base Logger Configuration
// Create the main logger instance with its configuration.
const logger = createLogger({
  // Set the minimum level for logs to be recorded.
  level: logLevel,
  // Define the log format using a combination of winston formats.
  format: format.combine(
    // Apply the custom sensitive data filtering format first.
    filterSensitiveInfo(),
    // Add a timestamp to the log entry.
    format.timestamp(),
    // Include the full stack trace for error objects.
    format.errors({ stack: true }),
    // Output the final log entry as a JSON string.
    format.json()
  ),
  // Add a default metadata tag to all log entries (useful for service identification).
  defaultMeta: { service: "shanks_web_app_backend" },
  // Configure the transports (where the logs go).
  transports: [
    // Transport 1: Logs errors (level "error" and above) to a specific file.
    new transports.File({ filename: "logs/error.log", level: "error" }),
    // Transport 2: Logs all messages (at or above the base 'level') to a combined file.
    new transports.File({ filename: "logs/combined.log" }),
  ],
});

// Conditional Console Transport
// Check if the application is NOT in production.
if (!isProduction) {
  // If not in production, add a console transport for real-time viewing.
  logger.add(
    new transports.Console({
      // Configure the console output to use colorization and a simple, readable format.
      format: format.combine(format.colorize(), format.simple()),
      // Set the console's level to "debug" (overriding the logger's base level to ensure all debug messages are shown).
      level: "debug",
    })
  );
}

// Listen for transport errors
// Register an event listener for any internal errors that might occur during the logging process (e.g., file write failure).
logger.on("error", (err) => {
  // Log the transport error to the standard console (outside of winston's control to ensure it's seen).
  console.error("Logger transport error:", err);
});

// Create a stream for Morgan to pipe HTTP logs to Winston
// Define a custom object with a 'write' method to serve as a stream interface for Morgan.
const morganStream = {
  // The 'write' method is called by Morgan every time it generates a log line.
  write: (message) => {
    // Log Morgan's output as an 'info' level message using the configured Winston logger.
    // The .trim() removes any trailing newline characters from Morgan's output.
    logger.info(message.trim());
  },
};

// Export both logger and morganStream so they can be used throughout the application.
module.exports = { logger, morganStream };