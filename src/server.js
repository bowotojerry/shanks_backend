// Load environment variables FIRST if we are NOT in production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const app = require('../src/app');
const mongoose = require('../config/database');
const { logger, morganStream } = require("../src/modules/utils/logger");


// health check for route
app.get("/api/v1/health", (req, res) => {
  const start = process.hrtime(); // Record start time

 res.json({
    status: "OK",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    responseTime: process.hrtime(start)[1]  // Convert nanoseconds to milliseconds
  });
});

const APP_PORT = process.env.APP_PORT || 3000;

app.listen(APP_PORT, () => {
  logger.info(
    `App is running on port:${APP_PORT}, in ${process.env.NODE_ENV} mode`
  );
});
