const User = require("../models/user");

exports.getAllUserHabits = async (req, res) => {
    try {
      const Users = await User.find();
      res.status(200).json(Users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };