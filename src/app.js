const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const { logger, morganStream } = require('../src/modules/utils/logger');
const globalErrorHandler = require('../src/modules/controllers/error-controller');
const app = express();

//express-inbuilt middleware
app.use(helmet()); // This applies the default set of security headers to all responses.
// Use Morgan middleware, piping logs to Winston
app.use(morgan('combined', { stream: morganStream }));
app.use(express.json()); // to parse request body data
app.use(express.urlencoded({ extended: true })); // to parse form data

// 4. CATCH-ALL 404 route handler
// app.all("*", (req, res, next) => {
//   next(new AppError(`oops...the page you are looking for (${req.originalUrl}) does not exist.`, 404))
// })

// 5. Error handling middleware
app.use(globalErrorHandler);

module.exports = app;
