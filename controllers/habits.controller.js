const { updateHabitById, createHabitById, fetchHabitByUserId, removeHabitById } = require("../models/habits");

exports.postHabit = (req, res, next) => {
  const { user_id } = req.params
  const habitData = req.body
  createHabitById(user_id, habitData).then((createdHabit) => {
    if (!createdHabit)
      return res.status(404).json({
        success: false,
        message: "user creation failed",
        error: "Unable get created user",
      });
    res.status(201).json({
      success: true,
      createdHabit,
    });
  })
  .catch(next)
};


exports.patchHabitById = (req, res, next) => {
  const { habit_id, user_id } = req.params;
  const habitBody = req.body
  updateHabitById(habit_id, user_id, habitBody).then((updatedHabit) => {
    res.status(201).json({
      success: true,
      updatedHabit,
    });
  })
  .catch(next)
};


exports.getHabitByUserId = (req, res, next) => {
  const { user_id } = req.params;
  fetchHabitByUserId(user_id)
    .then((allHabits) => {
        res.status(200).json({
          success: true,
          allHabits
        })
      })
      .catch(next)
  }

exports.deleteHabitById = (req, res, next)=>{
  const {user_id, habit_id} = req.params;
  removeHabitById(user_id, habit_id)
    .then(()=>{
      res.status(204).send({
      })
    })
    .catch(next)
}
