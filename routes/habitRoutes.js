const express = require("express");

const { requireAuth } = require("@clerk/express");
const {
  getHabits,
  postHabit,
  patchHabitById,
  deleteHabitById,
} = require("../controllers/habits.controller");

const router = express.Router();

router.route("/").get(requireAuth(), getHabits).post(requireAuth(), postHabit);

router
  .route("/:habit_id")
  .patch(requireAuth(), patchHabitById)
  .delete(requireAuth(), deleteHabitById);

module.exports = router;
