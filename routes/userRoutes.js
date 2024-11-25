const express = require("express");

const { requireAuth } = require("@clerk/express");
const { getUser, createUser } = require("../controllers/user.controller");

const router = express.Router();

router.route("/").get(requireAuth(), getUser).post(requireAuth(), createUser);

module.exports = router;
