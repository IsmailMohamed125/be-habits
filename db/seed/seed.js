const Habit = require("../../models/habits");
const User = require("../../models/user");

const seed = async ({ userData, habitData }) => {
  await User.deleteMany({});
  await User.insertMany(userData);
  await Habit.deleteMany({});
  await Habit.insertMany(habitData);
};

const dropUsers = async () => {
  await User.deleteMany({});
};

module.exports = { seed, dropUsers };
