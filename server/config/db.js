// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("MongDB Connected");
//   } catch (error) {
//     console.log("Database connection failed: ", error.message);
//     process.exit(1);
//   }
// };
// module.exports = connectDB;
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
    console.log("Database:", conn.connection.name);
  } catch (error) {
    console.log("Database connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
