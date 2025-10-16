const express = require("express");
const { logger, morganStream } = require("../src/modules/utils/logger");
const morgan = require("morgan");
const app = express();

//express-inbuilt middleware
app.use(express.json()); // to parse request body data
app.use(express.urlencoded({ extended: true })); // to parse form data
// Use Morgan middleware with a predefined format, piping logs to Winston
app.use(morgan("combined", { stream: morganStream }));


// 4. Catch-all route for 404 errors
// app.use('*', (req, res) => {
//   res.status(404).json({
//     error: 'Not Found',
//     message: `The requested resource ${req.originalUrl} was not found on the server`,
//   });
// });

// global error handling

module.exports = app;
