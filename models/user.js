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
  dailyHabits: [
    {
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
      },
      dailyComment: {
        type: String,
      },
      difficulty: {
        type: String,
      },
    },
  ],
  dailyComment: {
    type: String,
  },
  weeklyHabits: {
    type: Array,
  },
});

const User = model("users", UserSchema);

module.exports = User;
