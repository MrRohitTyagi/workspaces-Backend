const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  messages: {
    type: Array,
    default: [],
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },

  createdAT: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("messages", messageSchema);
