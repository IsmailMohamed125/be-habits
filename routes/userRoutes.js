const express = require("express");
const {
  signUp,
  login,
  logout,
  refreshToken,
  getMe,
} = require("../controllers/auth.controller");
const {
  patchHabitById,
  postHabit,
} = require("../controllers/habits.controller");
const protectRoute = require("../middleware/protectRoute");

const router = express.Router();

router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/refresh").post(refreshToken);

router.route("/me").get(protectRoute, getMe);

router.route("/:user_id/habits/:habit_id").patch(patchHabitById);

router.route("/:user_id/habits").post(postHabit);

module.exports = router;
