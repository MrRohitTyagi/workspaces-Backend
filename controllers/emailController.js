const EMAIL = require("../modals/emailModel");
const USER = require("../modals/userModal");
const { getUserSocketId } = require("../config/globalState");
const { io } = require("../app");
const cloudinary = require("cloudinary").v2;

const config = {
  cloud_name: process.env.CLOUDNERY_CLOUD_NAME,
  api_key: process.env.CLOUDNERY_API_KEY,
  api_secret: process.env.CLOUDNERY_API_SECRET,
};
cloudinary.config(config);

exports.createEmail = async (req, res) => {
  try {
    const newEmail = await EMAIL.create(req.body);
    const senderUser = await USER.findById(newEmail.sender).select(
      "-password -isDarkTheme -createdAT -__v"
    );

    for (const reci of newEmail.recipients) {
      USER.findOne({ email: reci }).then((data) => {
        const userSocketId = getUserSocketId(data._id);
        io.to(userSocketId).emit("NEW_EMAIL_RECEIVED", {
          ...newEmail._doc,
          isUnread: true,
          sender: senderUser,
        });
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

    if (newEmail.deletedBySender && newEmail.recipients.length === 0) {
      deleteEmailCompleteley(newEmail._id);
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
      deleteEmailCompleteley(newEmail._id);
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
    }).select("-password");

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

async function deleteEmailCompleteley(_id) {
  const email = await EMAIL.findByIdAndDelete(_id);
  // const email = await EMAIL.findById(_id);
  console.log("email", email);
  for (const imageUrl of email.attachments) {
    const public_id = imageUrl.match(/\/([^/]+)\.[a-z]+$/)?.[1];
    if (!public_id) continue;

    cloudinary.uploader.destroy(public_id, (error, result) => {
      if (error) {
        console.error(error);
      } else {
        console.log(result);
        console.log(
          `Image with public_id ${public_id} has been deleted from Cloudinary.`
        );
      }
    });
  }
}
