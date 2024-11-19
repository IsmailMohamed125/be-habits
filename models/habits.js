const { Schema, model, mongoose } = require("mongoose");


const User =  require("./user")

const HabitsSchema =  new Schema({
    user_id: {
      type:mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    dailyHabits: [{
      _id:{
        type: String
      },
      name: {
        type: String,
        required: true,
      },
      completed: {
        type: Boolean,
        required: true,
      },
      build: {
        type: Boolean,
        required: true

      },
      difficulty: {
        type: String,
      }
    }],
    weeklyHabits:[{
      _id:{
        type: String
      },
      name: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      required: true,
    },
    build: {
      type: Boolean,
      required: true
    },
    difficulty: {
      type: String,
    }
  }]
})

const Habit = model('Habit', HabitsSchema);

module.exports = Habit;

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
