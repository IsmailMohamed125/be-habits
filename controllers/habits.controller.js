const { updateHabitById, createHabitById, fetchHabitByUserId, removeHabitById } = require("../models/habits");

exports.postHabit = (req, res, next) => {
  const { user_id } = req.params
  const habitData = req.body
  createHabitById(user_id, habitData).then((createdHabit) => {
    console.log(createdHabit)
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


exports.getHabitByUserId = (req, res, next) => {
  const { user_id } = req.params;
  fetchHabitByUserId(user_id).then((allHabits) => {
      if (!allHabits)
        return res.status(404).json({
          success: false,
          message: "No habit found",
          error: "Unable to fetch habits",
        });
      res.status(200).json({
        success: true,
        allHabits
      })
    })
  }

exports.deleteHabitById = (req, res, next)=>{
  const {user_id, habit_id} = req.params;
  removeHabitById(user_id, habit_id)
    .then(()=>{
      res.status(204).send({
      })
    })
    .catch(err=>{
      return err
    })
}
