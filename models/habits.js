const { Schema, model, mongoose } = require("mongoose");
const User = require("./user");

exports.createHabitById = (user_id, habitData) => {
  return User.findById(user_id).then((userData) => {
    userData.dailyHabits.push(habitData);

    return userData.save() ;
  }).then((response) => {
    return response
  })
};

exports.updateHabitById = (habitId, user_id) => {
  return User.findById(user_id).then((user) => {
    const habit = user.dailyHabits.id(habitId);
    habit.completed = true
    return user.save()
  })
};
