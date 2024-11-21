const mongoose = require("mongoose");

require("dotenv").config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DBCONNECTIONSTRING);
    console.log("connected to DB");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  } 
};

module.exports = connectDB;
