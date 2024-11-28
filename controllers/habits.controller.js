const Habit = require("../models/habits");
const { clerkClient, getAuth } = require("@clerk/express");
const AppError = require("../utils/errorClass");

// Finished
exports.getHabits = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const habits = await Habit.find({ ...req.query, user: userId });
    res.status(200).json({
      status: "success",
      data: {
        habits,
      },
    });
  } catch (error) {
    next(error);
  }
};

//Finished
exports.postHabit = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const newHabit = await Habit.create({ ...req.body, user: userId });
    res.status(201).json({
      status: "success",
      data: {
        habit: newHabit,
      },
    });
  } catch (error) {
    next(error);
  }
};

//Finished
exports.patchHabitById = async (req, res, next) => {
  try {
    const habitObj = { ...req.body };
    const excludedFields = ["_id", "user", "id", "__v"];
    excludedFields.forEach((el) => {
      if (habitObj[el]) throw new AppError("Invalid field", 400);
    });

    const habit = await Habit.findByIdAndUpdate(req.params.habit_id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!habit) throw new AppError("No habit found with that ID", 404);

    res.status(200).json({
      status: "success",
      data: {
        habit,
      },
    });
  } catch (error) {
    next(error);
  }
};

//Finished
exports.deleteHabitById = async (req, res, next) => {
  try {
    const habit = await Habit.findByIdAndDelete(req.params.habit_id);
    if (!habit) throw new AppError("No habit found with that ID", 404);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

exports.midnightReset = async (req,res,next)=>{
  const { userId } = getAuth(req);
  const resetHabitBody = {
    completed: false
  }
  try {
    const reset = await Habit.updateMany({user: userId}, { $set: resetHabitBody});
    res.status(200).json({
      status: "success",
      data: reset
    })
  }
  catch(error){
    next(error)
  }
}
