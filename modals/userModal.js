const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
  isDarkTheme: {
    type: Boolean,
    default: false,
  },

  createdAT: {
    type: Date,
    default: Date.now,
  },
});

userSchema.statics.findByCredentials = async function (email, password) {
  const User = this;

  // Find the user by email
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid login credentials");
  }

  // Compare the provided password with the hashed password in the database
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid login credentials");
  }

  return user;
};

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    console.log("error", error);
    next(error);
  }
});
module.exports = mongoose.model("user", userSchema);
