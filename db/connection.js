const mongoose = require("mongoose");

let conn = null;

const connectDB = async () => {
  if (conn) return conn;

  try {
    conn = await mongoose.connect(process.env.DBCONNECTIONSTRING);
    return conn;
  } catch (error) {
    process.exit(1);
  }
};

const disconnectDB = async () => {
  if (conn) {
    await mongoose.disconnect();
    console.log("Database disconnected");
    conn = null;
  }
};

module.exports = { connectDB, disconnectDB };
