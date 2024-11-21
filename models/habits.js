const { Schema, model, mongoose, Types } = require("mongoose");
const db = require("../db/connection.js");
const User =  require("./user");
const { ValidationError, NotFoundError } = require("../utils/errorClasses.js");

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
    return allHabits.slice(-1)[0]
  })
  }



updateHabitById = (habitId, user_id, habitBody) => {
  const requiredBodyKeys = ["_id", "name", "completed", "build", "difficulty", "frequency"]
  const habitBodyKeys = Object.keys(habitBody)
  if(!mongoose.Types.ObjectId.isValid(user_id) || user_id.length !== 24){
    throw new ValidationError("Bad request: incorrect user ID format")
  }
  if(habitBodyKeys.length !== requiredBodyKeys.length || !habitBodyKeys.every(key=>requiredBodyKeys.includes(key))){
    throw new ValidationError("Bad request: invalid update document")
  }
  return Habit.updateOne({user_id, "allHabits._id": habitId}, {$set: {"allHabits.$": habitBody}})
  .then((res)=>{
    if(res.matchedCount === 0) throw new NotFoundError("Habit not found")
      return Habit.find({user_id}) //At the moment we don't know it's it's user or habit not found
    })
  .then(habit=>{
    const updated = habit[0].allHabits.id(habitId)
      return updated
  })
 };

fetchHabitByUserId = (user_id) => {
  if(!mongoose.Types.ObjectId.isValid(user_id) || user_id.length !== 24){
    throw new ValidationError("Bad request: incorrect user ID format")
  }
  return Habit.find({user_id}).then((habits) => {
    if(habits.length === 0) throw new NotFoundError("User not found")
    return habits[0].allHabits
  })
}

removeHabitById = (user_id, habit_id) =>{
  return Habit.updateOne({user_id}, {$pull: {allHabits: {_id: habit_id}}})
  .then((habits)=>{
    if(habits.matchedCount !== 1 || habits.modifiedCount < 1){
      throw new NotFoundError("Habit not found")
    }else{
      return habits
    }
  })

}
module.exports = { Habit, createHabitById, updateHabitById, fetchHabitByUserId, removeHabitById }