const { Schema, model } = require("mongoose");

const Habit = require('./habits')


const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  habits:{
    type: Schema.Types.ObjectId,
    ref: 'Habit'
  },
  dailyComment: {
    type: String,
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

// habits:[HabitSchema]