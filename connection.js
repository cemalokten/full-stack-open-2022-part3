const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const url = process.env.MONGODB_URI;
    mongoose.set("strictQuery", false);
    await mongoose.connect(url);
    console.log("Connected to the database");
  } catch (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    mongoose.disconnect()
  } catch (e) {
    console.log(e)
  }
}

module.exports = { connectDB, disconnectDB }
