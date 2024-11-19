const express = require("express");
const { createUser } = require("../controllers/user.controller");
const { patchHabitById, postHabit } = require("../controllers/habits.controller");

const router = express.Router();

router.route("/").post(createUser);

router.route("/:user_id/habits/:habit_id").patch(patchHabitById)

router.route("/:user_id/habits").post(postHabit)

module.exports = router;
