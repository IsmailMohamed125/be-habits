const { updateHabitById, createHabitById } = require("../models/habits");

exports.postHabit = (req, res, next) => {
  const { user_id } = req.params
  const habitData = req.body
  createHabitById(user_id, habitData).then((updatedUser) => {
    if (!updatedUser)
      return res.status(404).json({
        success: false,
        message: "user creation failed",
        error: "Unable get created user",
      });
    res.status(201).json({
      success: true,
      updatedUser,
    });
  })
};



exports.patchHabitById = (req, res, next) => {
  const { habit_id, user_id } = req.params;
  updateHabitById(habit_id, user_id).then((updatedHabit) => {
    if (!updatedHabit)
      return res.status(404).json({
        success: false,
        message: "user creation failed",
        error: "Unable get created user",
      });
    res.status(201).json({
      success: true,
      updatedHabit,
    });
  });
};
