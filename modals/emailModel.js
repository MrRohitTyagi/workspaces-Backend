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
  starredBy: {
    type: Array,
    require: true,
  },
  archivedBy: {
    type: Array,
    require: true,
  },
});

module.exports = mongoose.model("Email", EmailSchema);
