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
    const { msgId, message } = req.body;

    let messageDoc = await Message.findById(msgId).populate({
      path: "to from",
      select: "-password",
    });
    messageDoc.messages.push(message);
    await messageDoc.save();

    const userSocketId = getUserSocketId(messageDoc.to.email);

    console.log("userSocketId THIS", userSocketId);
    console.log(messageDoc);

    // io.to(userSocketId).emit("NEW_MESSAGE_RECEIVED", {
    //   message_id: messageDoc._id,
    //   message,
    // });
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
