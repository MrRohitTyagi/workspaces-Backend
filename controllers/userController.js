const USER = require("../modals/userModal");
const EMAIL = require("../modals/emailModel");
const { setUserSocketID } = require("../config/globalState");
const { io } = require("../app");
//create product -- admin

exports.configureUser = async (req, res) => {
  const { name, email } = req.body || {};
  const socketId = req.get("Socket_id");
  // io.to(socketId).emit("NEW_EMAIL_RECEIVED");

  try {
    setUserSocketID(email, socketId);
    let user;
    let isNew = false;

    user = await USER.findOne({ email: email });
    if (!user) {
      isNew = true;
      user = await USER.create({ name, email });
    }

    const emails = await EMAIL.find({
      $or: [{ sender: email }, { recipients: email }],
    });

    res.status(200).json({
      success: true,
      response: { _id: user._id, emailContent: (emails || []).reverse() },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
