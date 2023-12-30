const EMAIL = require("../modals/emailModel");
const { getUserSocketId } = require("../config/globalState");
const { io } = require("../app");

exports.createEmail = async (req, res) => {
  try {
    const newEmail = await EMAIL.create(req.body);

    for (const reci of newEmail.recipients) {
      const userSocketId = getUserSocketId(reci);
      // io.to(userSocketId).emit("NEW_EMAIL_RECEIVED", newEmail);
    }

    res.status(200).json({
      success: true,
      response: newEmail,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
exports.deleteEmail = async (req, res) => {
  const id = req.params.id;
  const emailToRemove = req?.params?.email;
  try {
    const newEmail = await EMAIL.findByIdAndUpdate(
      id,
      {
        $pull: { recipients: emailToRemove },
        $pull: { starredBy: emailToRemove },
        $pull: { archivedBy: emailToRemove },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
exports.updateEmail = async (req, res) => {
  console.log("req.body", req.body);
  const { updateingKey, _id, ...rest } = req.body;
  try {
    const newEmail = await EMAIL.findByIdAndUpdate(
      _id,
      { [updateingKey]: rest[updateingKey] },
      { new: true }
    );
    res.status(200).json({
      success: true,
      response: newEmail,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
exports.deleteEmailSent = async (req, res) => {
  const id = req.params.id;
  try {
    const newEmail = await EMAIL.findByIdAndUpdate(
      id,
      { sender: "EMPTY" },
      { new: true }
    );

    if (newEmail.recipients.length === 0) {
      await EMAIL.findByIdAndDelete(newEmail._id);
    }

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
