const express = require("express");
const { getAllUsers } = require("../controllers/user.controller");

const usersRouter = express.Router();

usersRouter.route("/").get(getAllUsers);

module.exports = usersRouter;