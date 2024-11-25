const User = require("../models/user");
const { clerkClient, getAuth } = require("@clerk/express");

// Finished
exports.getUser = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const user = await User.find({ clerkID: userId }).populate("habits");
    if (!user) throw new AppError("No user found with that ID", 404);

    res.status(200).json({
      status: "success",
      data: {
        user: user[0],
      },
    });
  } catch (error) {
    next(error);
  }
};

// When a user signs up use this endpoint
// Finished
exports.createUser = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const user = await clerkClient.users.getUser(userId);
    const newUser = await User.create({
      clerkID: user.id,
      email: user.emailAddresses[0].emailAddress,
    });
    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    next(error);
  }
};
