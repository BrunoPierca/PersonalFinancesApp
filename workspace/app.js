// Packages
const express = require("express");
const db = require("./config/db.js");
require("dotenv/config");
var morgan = require("morgan");
const cors = require("cors");
const jwt = require("jsonwebtoken");

// App
const app = express();

const oneMonth = 1000 * 60 * 60 * 24 * 31;

// Middleware
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Port
app.listen(process.env.PORT);
console.log("App listening on port: " + process.env.PORT);

// Routes
let operationsRouter = require("./routes/operations");
let authRouter = require("./routes/userAuth");

app.use("/operations", operationsRouter);
app.use("/auth", authRouter);

module.exports = app;
