const Message = require("../modals/chatModel");

exports.newChat = async (req, res) => {
  try {
    const { to, from, messages } = req.body;
    const newMessage = new Message({
      messages,
      to,
      from,
    });

    await newMessage.save();

    res.status(200).json({ success: true });
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

    let messageDoc = await Message.findById(msgId);
    messageDoc.messages.push(message);
    await messageDoc.save();

    console.log("Message appended successfully!");
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
