const Message = require("../modals/chatModel");
const { io } = require("../app");
const { getUserSocketId } = require("../config/globalState");

exports.newChat = async (req, res) => {
  try {
    const { to, from, messages } = req.body;
    const newMessage = new Message({
      messages,
      to,
      from,
    });

    await newMessage.save();
    console.log("newMessage", newMessage);
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

    console.log("userSocketId THIS", userSocketId);

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
