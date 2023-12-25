const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  emailContent: {
    type: Array,
    default: [],
  },

  createdAT: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("user", userSchema);
