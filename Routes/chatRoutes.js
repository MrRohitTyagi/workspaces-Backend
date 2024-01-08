const express = require("express");

const {
  newChat,
  getAllChatsPeruser,
  saveMessages,
  getUserChat,
  deleteSingleMessage,
  saveEditedMessage,
} = require("../controllers/chatController");
const router = express.Router();

router.route("/create").post(newChat);
router.route("/get-all-chats/:id").get(getAllChatsPeruser);
router.route("/get-user-chat/:id").get(getUserChat);
router.route("/save-message").post(saveMessages);
router.route("/delete-single-message").put(deleteSingleMessage);
router.route("/save-edited-message").put(saveEditedMessage);

module.exports = router;
