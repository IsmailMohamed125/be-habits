const User = require("../models/user");
const Habit = require("../models/habits");

exports.createUser = (req, res, next) => {
  const { username, email } = req.body;
  // cosnt userid =  req.user.id
  const newHabits = new Habit({
    dailyHabits: [],
    weeklyHabits: [],
  });
  newHabits.save().then((saved) => {
    return User.create({
      username,
      email,
      habits: saved._id,
    })
      .then((createdUser) => {
        return Promise.all([
          createdUser,
          Habit.findByIdAndUpdate(createdUser.habits, {
            user_id: createdUser._id,
          }),
        ]);
      })
      .then((result) => {
        const createdUser = result[0];
        if (!createdUser) {
          return res.status(404).json({
            success: false,
            message: "user creation failed",
            error: "Unable get created user",
          });
        }
        return res.status(201).json({
          success: true,
          createdUser,
        });
      })
      .catch((error) => {
        res.status(404).json({
          success: false,
          error: error.message,
        });
      });
  });
};
