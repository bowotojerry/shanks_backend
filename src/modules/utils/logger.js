const { createLogger, format, transports } = require("winston");
const morgan = require("morgan");

// Determine the current environment
const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";

// Define Log Levels
const logLevel = isProduction ? "info" : "debug";

// Custom Format (Filtering)
const filterSensitiveInfo = format((info) => {
  if (info.password) info.password = "****";
  if (info.apiKey) delete info.apiKey;
  if (info.message && typeof info.message === "string") {
    info.message = info.message.replace(
      /\d{4}-\d{4}-\d{4}-\d{4}/g,
      "****-****-****-****"
    );
  }
  if (info.error && typeof info.error === "object") {
    if (info.error.password) info.error.password = "****";
    if (info.error.apiKey) delete info.error.apiKey;
  }
  return info;
});

// Base Logger Configuration
const logger = createLogger({
  level: logLevel,
  format: format.combine(
    filterSensitiveInfo(),
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: "shanks_web_app_backend" },
  transports: [
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
  ],
});

// Conditional Console Transport
if (!isProduction) {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
      level: "debug",
    })
  );
}

// Listen for transport errors
logger.on("error", (err) => {
  console.error("Logger transport error:", err);
});

// Create a stream for Morgan to pipe HTTP logs to Winston
const morganStream = {
  write: (message) => {
    // Log Morgan's output as an 'info' level message
    logger.info(message.trim());
  },
};

// Export both logger and morganStream
module.exports = { logger, morganStream };
