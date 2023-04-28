// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();
console.log("Loaded .env file:", process.env.API_KEY);
// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// Session configuration
const sessionConfig = require("./config/session.config");
sessionConfig(app);

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// default value for title local
const capitalize = require("./utils/capitalize");
const projectName = "fitness-tracker";

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

/* Handling routes here */
/* 1. index route */
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

/* 2. auth route */
const authRoutes = require("./routes/auth.routes");
app.use("/", authRoutes);
// Testing for Session Management - can be removed later
const sessionRoutes = require("./routes/session.routes");
app.use("/session", sessionRoutes);

const protectedRoutes = require("./routes/protected.routes");
app.use("/", protectedRoutes);

/* 3. api route */
const apiRouter = require("./routes/api.routes");
app.use("/api", apiRouter);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
