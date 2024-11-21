const express = require("express");

const { createUser } = require("../controllers/user.controller");
const { patchHabitById, postHabit, getHabitByUserId, deleteHabitById } = require("../controllers/habits.controller");

const router = express.Router();

router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/refresh").post(refreshToken);


router.route("/:user_id/habits/:habit_id").patch(patchHabitById).delete(deleteHabitById)

router.route("/:user_id/habits").post(postHabit).get(getHabitByUserId)

module.exports = router;
