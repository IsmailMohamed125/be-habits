const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { UnauthorizedError, ValidationError } = require("../utils/errorClasses");

const protectRoute = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Unauthorized - No token provided"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const logedInUser = await User.findById(decoded.userId);
    if (!logedInUser) {
      return next(new ValidationError("User not found"));
    }
    req.user = {
      id: logedInUser._id,
      username: logedInUser.username,
      email: logedInUser.email,
    };
    next();
  } catch (error) {
    next(new UnauthorizedError("Unauthorized - Invalid token"));
  }
};

module.exports = protectRoute;
