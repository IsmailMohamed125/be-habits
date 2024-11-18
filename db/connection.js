const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DBCONNECTIONSTRING, {
      useNewUrlParser: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
