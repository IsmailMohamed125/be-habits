const { Schema, model, mongoose, Types } = require("mongoose");
const db = require("../db/connection.js");
const User =  require("./user")

const HabitsSchema =  new Schema({
    user_id: {
      type:mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    allHabits: [{
      _id:{
        type: mongoose.Schema.Types.ObjectId,
        default: ()=> new Types.ObjectId() 
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
        required: true
      },
      frequency: {
        type: String,
        required: true,
        default: ()=> "daily"
      }
    }]
})

const Habit = model('Habit', HabitsSchema);



createHabitById = (user_id, habitData) => {
  return Habit.updateOne({user_id}, {$push: {allHabits: habitData}})
  .then(postedHabit=>{
    return Habit.find({user_id})
  }).then(habits=>{
    //implemetn logic to check if modifiedCount: 1 
    const {allHabits} = habits[0]
    console.log(allHabits.slice(-1)[0])
    return allHabits.slice(-1)[0]
  })
  }



updateHabitById = (habitId, user_id) => {
  return Habit.find({user_id}).then((habits) => {
    const habit = habits[0].allHabits.id(habitId);
    if (habit.completed === false){
    habit.set("completed", true)
  }else{
   habit.set("completed", false) 
  }
  return habits[0].save()
})
.then(savedHabit=>{
  return Habit.find({user_id})
  .then(habit=>{
    return habit[0].allHabits.id(habitId)
  })
})
};

fetchHabitByUserId = (user_id) => {
  return Habit.find({user_id}).then((habits) => {
    return habits[0].allHabits
  })
}

removeHabitById = (user_id, habit_id) =>{
  return Habit.updateOne({user_id}, {$pull: {allHabits: {_id: habit_id}}})
  .then((habits)=>{
    if(habits.matchedCount !== 1 || habits.modifiedCount < 1){
      Promise.reject({status: 400, message: "Bad Request"})
    }else{
      return habits
    }
  })

}
module.exports = { Habit, createHabitById, updateHabitById, fetchHabitByUserId, removeHabitById }