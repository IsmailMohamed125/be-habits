const express = require("express");
const userRouter = require("./userRoutes");
const usersRouter = require("./usersRoutes")

const router = express.Router();

router.use("/user", userRouter);

router.use("/users", usersRouter)

router.use("/users/:user_id/habits", habitsRouter)


module.exports = router;
