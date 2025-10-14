const { createLogger, format, transports } = require('winston');

// Determine the current environment
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

// Define Log Levels
// Use 'info' for production and 'debug' for development (most verbose)
const logLevel = isProduction ? 'info' : 'debug';

// Custom Format (Filtering)
const filterSensitiveInfo = format((info) => {
    // Logic to filter sensitive data (passwords, API keys, etc.)
    if (info.password) info.password = '****';
    if (info.apiKey) delete info.apiKey;
    if (info.message && typeof info.message === 'string') {
        info.message = info.message.replace(/\d{4}-\d{4}-\d{4}-\d{4}/g, '****-****-****-****');
    }
    // ... filtering for info.error remains here
    if (info.error && typeof info.error === 'object') {
        if (info.error.password) info.error.password = '****';
        if (info.error.apiKey) delete info.error.apiKey;
    }
    return info;
});

//Base Logger Configuration
const logger = createLogger({
    // Set the overall level based on the environment
    level: logLevel, 
    format: format.combine(
        filterSensitiveInfo(),
        format.timestamp(),
        format.errors({ stack: true }),
        format.json()
    ),
    defaultMeta: { service: 'shanks_website' },
    transports: [
        // Always log errors and combined logs to files in all environments
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' })
    ]
});

//Conditional Console Tranports
// Add the console transport only when NOT in production
if (!isProduction) {
    logger.add(
        new transports.Console({
            // Use 'simple' or 'cli' format for readability in development
            format: format.combine(format.colorize(), format.simple()),
            // Set console level to debug so all messages are shown
            level: 'debug' 
        })
    );
}

// Listen for transport errors
logger.on('error', (err) => {
    console.error('Logger transport error:', err);
});

module.exports = logger;