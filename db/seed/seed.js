const Habit = require("../../models/habits");
const User = require("../../models/user");
const Journal = require("../../models/journal")

const seed = async ({ userData, habitData, journalData }) => {
  await User.deleteMany({});
  await User.insertMany(userData);
  await Habit.deleteMany({});
  await Habit.insertMany(habitData);
  await Journal.deleteMany({});
  await Journal.insertMany(journalData);
};

const dropUsers = async () => {
  await User.deleteMany({});
};

module.exports = { seed, dropUsers };
