const Message = require("../modals/chatModel");
const { io } = require("../app");
const { getUserSocketId } = require("../config/globalState");
const { info } = require("better-console");
const cloudinary = require("cloudinary").v2;

const config = {
  cloud_name: process.env.CLOUDNERY_CLOUD_NAME,
  api_key: process.env.CLOUDNERY_API_KEY,
  api_secret: process.env.CLOUDNERY_API_SECRET,
};
cloudinary.config(config);

exports.newChat = async (req, res) => {
  try {
    const { to, from, messages } = req.body;
    const newMessage = new Message({
      messages,
      to,
      from,
    });

    await newMessage.save();
    await newMessage.populate({
      path: "to from",
      select: "-password",
    });
    res.status(200).json({ success: true, response: newMessage });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

exports.getAllChatsPeruser = async (req, res) => {
  try {
    const { id } = req.params;

    const allMessages = await Message.find({
      $or: [{ to: id }, { from: id }],
    }).populate({
      path: "to from",
      select: "-password",
    });

    res.status(200).json({
      success: true,
      response: allMessages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
exports.saveMessages = async (req, res) => {
  try {
    const { message_id, message, to } = req.body;

    let messageDoc = await Message.findById(message_id).populate({
      path: "to from",
      select: "-password",
    });
    const newMessage = { ...message, timestamp: new Date().getTime() };
    messageDoc.messages.push(newMessage);
    await messageDoc.save();

    const userSocketId = getUserSocketId(to);

    io.to(userSocketId).emit("NEW_MESSAGE_RECEIVED", {
      message_id: messageDoc._id,
      message: newMessage,
    });
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
exports.getUserChat = async (req, res) => {
  try {
    const { id } = req.params;
    const chat = await Message.findById(id).populate({
      path: "to from",
      select: "-password",
    });
    res.status(200).json({ success: true, response: chat });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
exports.deleteSingleMessage = async (req, res) => {
  const { chat_id, message_id, to } = req.body;
  info({ chat_id, message_id, to });
  try {
    const chat = await Message.findById(chat_id);
    const messageindex = chat.messages.findIndex((m) => m._id === message_id);
    const perMessage = chat.messages.find((m) => m._id === message_id);
    if (perMessage.image) {
      deleteMessageImage(perMessage.image);
    }
    chat.messages.splice(messageindex, 1);
    await chat.save();

    const userSocketId = getUserSocketId(to);
    io.to(userSocketId).emit("DELETE_SINGLE_MESSAGE", {
      message_id: message_id,
      chat_id: chat_id,
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
async function deleteMessageImage(imageUrl) {
  const public_id = imageUrl.match(/\/([^/]+)\.[a-z]+$/)?.[1];
  if (!public_id) return;

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
exports.saveEditedMessage = async (req, res) => {
  const { chat_id, message_id, to, msg } = req.body;

  try {
    const chat = await Message.findById(chat_id);

    const updatedMessages = chat.messages.map((m) => {
      if (m._id === message_id) {
        info({ chat_id, message_id, to, msg });
        return { ...m, msg, edited: true };
      } else return m;
    });

    chat.messages = updatedMessages;

    await chat.save();

    const userSocketId = getUserSocketId(to);

    io.to(userSocketId).emit("EDITED_SINGLE_MESSAGE", {
      message_id: message_id,
      msg,
      chat_id: chat_id,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
