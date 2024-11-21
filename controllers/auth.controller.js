const User = require("../models/user");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");
const {
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
} = require("../utils/errorClasses");

exports.signUp = async (req, res, next) => {
  try {
    const { username, email, password, passwordConfirm } = req.body;

    const newUser = await User.create({
      username,
      email,
      password,
      passwordConfirm,
    });

    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        status: "success",
        data: {
          user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
          },
          accessToken,
        },
      });
  } catch (error) {
    next(new ValidationError(error));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ValidationError("Email and password required");
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        status: "success",
        data: {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
          },
          accessToken,
        },
      });
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res) => {
  res
    .clearCookie("refreshToken")
    .json({ status: "success", message: "Logged out successfully" });
};

exports.refreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return next(new UnauthorizedError("No refresh token provided"));
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = generateAccessToken(decoded.userId);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    next(new ForbiddenError("Invalid refresh token"));
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new ValidationError("User not found"));
    }

    res.status(200).json({
      status: "success",
      data: {
        user: { id: user._id, username: user.username, email: user.email },
      },
    });
  } catch (error) {
    next(error); // Pass to centralized error handler
  }
};
