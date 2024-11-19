const express = require("express");
const {
  signUp,
  login,
  logout,
  refreshToken,
  getMe,
} = require("../controllers/auth.controller");
const protectRoute = require("../middleware/protectRoute");

const router = express.Router();

router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/refresh").post(refreshToken);

router.route("/me").get(protectRoute, getMe);

module.exports = router;
