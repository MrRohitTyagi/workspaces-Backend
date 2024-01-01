const EMAIL = require("../modals/emailModel");
const USER = require("../modals/userModal");
const { getUserSocketId } = require("../config/globalState");
const { io } = require("../app");

exports.createEmail = async (req, res) => {
  try {
    const newEmail = await EMAIL.create(req.body);

    for (const reci of newEmail.recipients) {
      const userSocketId = getUserSocketId(reci);
      io.to(userSocketId).emit("NEW_EMAIL_RECEIVED", {
        ...newEmail._doc,
        isUnread: true,
      });
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
        $pull: {
          recipients: emailToRemove,
          starredBy: emailToRemove,
          archivedBy: emailToRemove,
        },
      },
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

exports.updateEmail = async (req, res) => {
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
exports.getSingleEmail = async (req, res) => {
  const id = req.params.id;
  try {
    const email = await EMAIL.findById(id);
    res.status(200).json({
      success: true,
      response: email,
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
      { deletedBySender: true },
      { new: true }
    );

    if (newEmail.recipients.length === 0) {
      await EMAIL.findByIdAndDelete(newEmail._id);
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
exports.searchEmails = async (req, res) => {
  const query = req.query.search;
  try {
    const foundEmails = await USER.find({
      email: { $regex: new RegExp(query, "i") },
    }).select("email");

    res.status(200).json({
      success: true,
      response: foundEmails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
