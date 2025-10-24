// Import the main Express framework library.
const express = require('express');
// Import the 'morgan' library, an HTTP request logger middleware for node.js. (Though not used directly here, it's typically imported to set up the stream format).
const morgan = require('morgan');
// Import the 'helmet' library, which helps secure Express apps by setting various HTTP headers.
const helmet = require('helmet');
// Destructure and import the custom 'logger' (Winston instance) and the 'morganStream' (Winston-compatible stream) from the logging utility file.
const { logger, morganStream } = require('../src/modules/utils/logger');
// Import the custom global error handling middleware.
const globalErrorHandler = require('../src/modules/controllers/error-controller');
// Create an instance of the Express application.
const app = express();

//express-inbuilt middleware

// Use the helmet middleware. This applies the default set of security headers to all responses.
app.use(helmet()); 
// Use the Morgan middleware to log HTTP requests.
// 'combined' is the format string (verbose, includes request/response info).
// Logs are piped to the 'morganStream', which directs them into the Winston logger.
app.use(morgan('combined', { stream: morganStream }));
// Use Express's built-in middleware to parse incoming JSON request bodies (e.g., from POST requests).
app.use(express.json()); // to parse request body data
// Use Express's built-in middleware to parse incoming URL-encoded form data (e.g., from traditional HTML forms).
// { extended: true } allows for rich objects and arrays to be encoded in the URL-encoded format.
app.use(express.urlencoded({ extended: true })); // to parse form data

// 4. CATCH-ALL 404 route handler
// A commented-out block showing how to implement a catch-all route handler.
// app.all("*", (req, res, next) => {
//   // If any request reaches this point, it means no previous route matched.
//   // It creates a new error (e.g., an AppError) with a 404 status and passes it to the error-handling stack via 'next()'.
//   next(new AppError(`oops...the page you are looking for (${req.originalUrl}) does not exist.`, 404))
// })

// 5. Error handling middleware
// Mount the global error handling middleware. 
// Express recognizes a function with four arguments (err, req, res, next) as the error handler.
// This must be placed AFTER all other routes and middleware to catch errors.
app.use(globalErrorHandler);

// Export the configured Express application instance.
module.exports = app;