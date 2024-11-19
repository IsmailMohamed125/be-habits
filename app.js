const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const connectDB = require("./db/connection");
const apiRouter = require("./routes/apiRoutes");
const errorHandler = require("./controllers/error.controller");
const { NotFoundError } = require("./utils/errorClasses");
connectDB();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api", apiRouter);

app.all("/*", (req, res, next) => {
  next(new NotFoundError("Route not Found"));
});

app.use(errorHandler);

module.exports = app;
