// Load environment variables FIRST if we are NOT in production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const { logger, morganStream } = require("./modules/utils/logger");
const morgan = require("morgan");
const { default: mongoose } = require("mongoose");

const app = express();

//express-inbuilt middleware
app.use(express.json()); // to parse request body data
app.use(express.urlencoded({ extended: true })); // to parse form data
// Use Morgan middleware with a predefined format, piping logs to Winston
app.use(morgan("combined", { stream: morganStream }));

// health check for route
app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "OK",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disonnected",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// 404 error to catch unmatched routes
// app.use('*', (req, res) => {
//   res.status(404).json({
//     sucess: false,
//     message: "Route not found",
//   });
// });

// error handling

const APP_PORT = process.env.APP_PORT;

app.listen(APP_PORT, () => {
  logger.info(
    `App is running on port:${APP_PORT}, in ${process.env.NODE_ENV} mode`
  );
});
