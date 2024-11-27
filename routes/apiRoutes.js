const express = require("express");
const userRouter = require("./userRoutes");
const habitRouter = require("./habitRoutes");
const journalRouter = require("./journalRoutes");
const endpoints = require("../endpoints.json");

const router = express.Router();

router.use("/user", userRouter);
router.use("/habit", habitRouter);
router.use("/journal", journalRouter)

router.route("/").get((req, res, next) => {
  res.status(200).send({ endpoints: endpoints });
});

module.exports = router;

