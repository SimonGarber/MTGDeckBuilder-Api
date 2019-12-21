const mongoose = require("mongoose");
const connectDB = async () => {
  const conn = await mongoose.connect(
    "mongodb+srv://admin:admin1234@cluster0-dposj.mongodb.net/test?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    }
  );
  console.log(`mongoDB connected, ${conn.connection.host}`);
};

module.exports = connectDB;
