// config/db.js
// Standalone MongoDB connection helper.
//
// NOTE: this file is currently NOT imported anywhere (server.js connects
// to Mongo inline instead). Kept here unchanged, with a clearer variable
// name (connection instead of conn), in case you decide to wire it in.

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Reads MONGO_URI (different name than server.js's MONGODB_URI - see TODO in server.js)
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // stop the app if we can't reach the database
  }
};

module.exports = connectDB;