const express = require("express");
const { getAllUserHabits } = require("../controllers/habits.controller");

const usersRouter = express.Router();

usersRouter.route("/").get(getAllUserHabits);

module.exports = usersRouter;