const { Schema, model, mongoose } = require("mongoose");
const db = require("../db/connection.js");
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



createHabitById = (user_id, habitData, frequency) => {
  return Habit.find({user_id}).then((userHabits) => {
    if (frequency === "daily"){
    userHabits[0].dailyHabits.push(habitData);
  }else if(frequency === "weekly"){
    userHabits[0].weeklyHabits.push(habitData);
  }
    return userHabits[0].save() ;
  })
  }


updateHabitById = (habitId, user_id) => {
  return Habit.find({user_id}).then((habits) => {
    const habit = habits[0].dailyHabits.id(habitId)?
    habits[0].dailyHabits.id(habitId):
    habits[0].weeklyHabits.id(habitId);
    if (habit.completed === false){
    habit.set("completed", true)
  }else{
   habit.set("completed", false) 
  }
  return habits[0].save()
})
};

fetchHabitByUserId = (user_id) => {
  return Habit.find({user_id}).then((habits) => {
    return habits[0]
  })
}
module.exports = { Habit, createHabitById, updateHabitById, fetchHabitByUserId }