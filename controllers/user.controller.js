const User = require("../models/user");

exports.createUser = async (req, res) => {
  try {
    const userData = await req.body;
    //create a new user then save
    await User.create(userData)
      .then((createdUser) => {
        if (!createdUser)
          return res.status(404).json({
            success: false,
            message: "user creation failed",
            error: "Unable get created user",
          });
        res.status(201).json({
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
