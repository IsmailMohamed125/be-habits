const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  dailyHabits: {
    type: Array,
  },
  dailyComment: {
    type: String,
  },
  weeklyHabits: {
    type: Array,
  },
});

const User = model("users", UserSchema);

module.exports = User;
