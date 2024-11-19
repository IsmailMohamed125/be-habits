const { Schema, model } = require("mongoose");
const Habit = require('./habits')

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  habits:{
    type: Schema.Types.ObjectId,
    ref: 'Habit'
  },
  dailyComment: {
    type: String,
  },
});

const User = model("users", UserSchema);

module.exports = User;

// habits:[HabitSchema]