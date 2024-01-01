const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    default:
      "https://res.cloudinary.com/derplm8c6/image/upload/v1690776482/vgonkn7ij7qlnskkldpp.png",
  },

  createdAT: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("user", userSchema);
