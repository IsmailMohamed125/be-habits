const { Schema, model, mongoose } = require("mongoose");

const HabitsSchema = new Schema(
  {
    user: {
      type: String,
      ref: "User",
      required: [true, "Habit must belong to a user"],
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
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: {
        values: ["easy", "medium", "hard"],
        message: "Difficulty is either: easy, medium or hard",
      },
    },
    frequency: {
      type: String,
      required: true,
      default: () => "daily",
      enum: {
        values: ["daily", "weekly"],
        message: "Frequency is either: daily or weekly",
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Habit = model("Habit", HabitsSchema);

module.exports = Habit;
