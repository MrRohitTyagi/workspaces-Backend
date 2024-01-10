const mongoose = require("mongoose");

const groupsSchema = new mongoose.Schema({
  messages: {
    type: Array,
    default: [],
  },
  members: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
  },
  admins: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: "user",
  },
  createdAT: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("groups", groupsSchema);
