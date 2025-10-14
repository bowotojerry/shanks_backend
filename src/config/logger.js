const { createLogger, format, transports } = require('winston');

// Check if the environment is production
const isProduction = process.env.NODE_ENV === 'production';

// Custom format to filter sensitive information
const filterSensitiveInfo = format((info) => {
  // Mask sensitive fields
  if (info.password) {
    info.password = '****';
  }
  if (info.apiKey) {
    delete info.apiKey; // Remove completely
  }
  // Mask credit card numbers or similar patterns in the message
  if (info.message && typeof info.message === 'string') {
    info.message = info.message.replace(/\d{4}-\d{4}-\d{4}-\d{4}/g, '****-****-****-****');
  }
  // Mask sensitive fields in the error object, if present
  if (info.error && typeof info.error === 'object') {
    if (info.error.password) {
      info.error.password = '****';
    }
    if (info.error.apiKey) {
      delete info.error.apiKey;
    }
  }
  return info;
});

// Create a custom logger
const logger = createLogger({
  level: 'info', // Only log messages at 'info' level or higher
  format: format.combine(
    filterSensitiveInfo(), // Apply sensitive data filter
    format.timestamp(), // Add timestamp
    format.errors({ stack: true }), // Capture stack traces for errors
    format.json() // Output as JSON
  ),
  defaultMeta: { service: 'my-app' }, // Add metadata
  transports: [
    // Log to a file (errors only)
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Log all messages to combined file
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

// Only log to console in non-production environments
if (!isProduction) {
  logger.add(
    new transports.Console({
      format: format.simple() // Human-readable format for development
    })
  );
}

// Example logs with sensitive data
logger.info('Hello, world!', { userId: '12345', password: 'secret123', apiKey: 'xyz123' });
logger.warn('This is a warning', { creditCard: '1234-5678-9012-3456' });
logger.error('Something went wrong!', { error: new Error('Test error'), password: 'secret123' });