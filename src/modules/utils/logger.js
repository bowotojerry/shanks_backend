// logger.js
const { createLogger, format, transports } = require('winston');

// Check if the environment is production
const isProduction = process.env.NODE_ENV === 'production';

// Custom format to filter sensitive information
const filterSensitiveInfo = format((info) => {
  if (info.password) {
    info.password = '****';
  }
  if (info.apiKey) {
    delete info.apiKey;
  }
  if (info.message && typeof info.message === 'string') {
    info.message = info.message.replace(/\d{4}-\d{4}-\d{4}-\d{4}/g, '****-****-****-****');
  }
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
  level: process.env.NODE_ENV || 'development',
  format: format.combine(
    filterSensitiveInfo(),
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: 'shanks_website' },
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

// Listen for transport errors
logger.on('error', (err) => {
  console.error('Logger transport error:', err);
});

// Only log to console in non-production environments
if (!isProduction) {
  logger.add(
    new transports.Console({
      format: format.simple()
    })
  );
}

module.exports = logger;