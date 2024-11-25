require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { clerkMiddleware } = require("@clerk/express");
const apiRouter = require("./routes/apiRoutes");
const AppError = require("./utils/errorClass");
const errorHandler = require("./controllers/error.controller");
const { connectDB } = require("./db/connection");

const app = express();

app.use(cors());
app.use(clerkMiddleware());
app.use(express.json());

connectDB();
app.use("/api/v1", apiRouter);

app.all("/*", (req, res, next) => {
  next(new AppError("Route not Found", 404));
});

app.use(errorHandler);

module.exports = app;
