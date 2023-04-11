const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const password = process.env.MONGO_PASSWORD;
    const url = `mongodb+srv://admin:${password}@cluster0.dnn600n.mongodb.net/?retryWrites=true&w=majority`;

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
