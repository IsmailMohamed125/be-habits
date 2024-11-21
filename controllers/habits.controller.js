const { updateHabitById, createHabitById, fetchHabitByUserId } = require("../models/habits");

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
    console.log(updatedHabit)
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

exports.postHabit = (req, res, next) => {
  const { frequency } = req.query
  const { user_id } = req.params
  const habitData = req.body
  createHabitById(user_id, habitData, frequency).then((updatedHabit) => {
    console.log(updatedHabit, "YOOO IM JARVIS IN CONTROLLER")
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
  })
};
// const { dailyHabits, weeklyHabits } = response
exports.getHabitByUserId = (req, res, next) => {
  const { user_id } = req.params;
  fetchHabitByUserId(user_id).then(({dailyHabits, weeklyHabits}) => {
      if (!dailyHabits)
        return res.status(404).json({
          success: false,
          message: "No habit found",
          error: "Unable to fetch habits",
        });
      res.status(200).json({
        success: true,
        habits: {dailyHabits, weeklyHabits}
      })
    })
  }


