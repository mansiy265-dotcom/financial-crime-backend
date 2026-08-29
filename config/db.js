const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://mansiy265_db_user:FVn5p9dVUe97b3qE@cluster0.rgq50bc.mongodb.net/financialCrimeDB?retryWrites=true&w=majority&appName=Cluster0"
    );

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Database Error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;