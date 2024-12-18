const { Schema, model } = require("mongoose");

const Habit = require("./habits");

const Journal = require("./journal")

const UserSchema = new Schema(
  {
    clerkID: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.virtual("habits", {
  ref: "Habit",
  foreignField: "user",
  localField: "clerkID",
});

UserSchema.virtual("journalEntries", {
  ref: "Journal",
  foreignField: "user",
  localField: "clerkID",
});

const User = model("Users", UserSchema);

module.exports = User;
