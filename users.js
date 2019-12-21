const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  cards: {
    type: Array,
    require: false
  }
});
module.exports = mongoose.model("User", userSchema);
