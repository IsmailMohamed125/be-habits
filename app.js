const express = require("express");
const cors = require("cors");
const app = express();
const connectDB = require("./db");
const apiRouter = require("./routes/apiRoutes");
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

module.exports = app;
