const express = require("express");
const { logger, morganStream } = require("../src/modules/utils/logger");
const morgan = require("morgan");
const globalErrorHandler = require('../src/modules/controllers/error-controller')
const app = express();

//express-inbuilt middleware
app.use(express.json()); // to parse request body data
app.use(express.urlencoded({ extended: true })); // to parse form data
// Use Morgan middleware, piping logs to Winston
app.use(morgan("combined", { stream: morganStream }));


// 4. CATCH-ALL 404 route handler
// app.all("*", (req, res, next) => {
//   next(new AppError(`Cant find ${req.originalUrl} on this server`, 404))
// })


// 5. Error handling middleware
app.use(globalErrorHandler);

module.exports = app;
