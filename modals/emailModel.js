const mongoose = require("mongoose");

const EmailSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  recipients: {
    type: Array,
    require: true,
  },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  isStarred: {
    type: Object,
    default: {},
  },
  isArchived: {
    type: Object,
    default: {},
  },
});

module.exports = mongoose.model("Email", EmailSchema);
