const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://admin:admin1234@cluster0-dposj.mongodb.net/test?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    }
  );
};

module.exports = connectDB;

// mongoimport --host cluster0-shard-00-02-dposj.mongodb.net:27017 --db mtgcards --collection data2 --type json --file ./scryfall-default-cards.json --jsonArray --authenticationDatabase admin --ssl --username admin --password admin1234
