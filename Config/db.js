const mongoose = require("mongoose");

const connectDB = async () => {
  const conn = await mongoose.connect("mongodb+srv://admin:anas12345@cluster0.nujj0tq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`mongodb connected:${conn.connection.host}`);
};

module.exports = connectDB;