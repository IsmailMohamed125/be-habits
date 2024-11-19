const { Schema, model } = require("mongoose");
const bcryptjs = require("bcryptjs");

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Password confirmation is required"],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Passwords need to match",
    },
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  this.passwordConfirm = undefined;
});

UserSchema.methods.correctPassword = async function (
  inputedPassword,
  userPassword
) {
  return await bcryptjs.compare(inputedPassword, userPassword);
};

const User = model("users", UserSchema);

module.exports = User;
