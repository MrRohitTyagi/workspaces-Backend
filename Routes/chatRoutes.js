const express = require("express");

const {
  newChat,
  getAllChatsPeruser,
  saveMessages,
  getUserChat,
} = require("../controllers/chatController");
const router = express.Router();

router.route("/create").post(newChat);
router.route("/get-all-chats/:id").get(getAllChatsPeruser);
router.route("/get-user-chat/:id").get(getUserChat);
router.route("/save-message").post(saveMessages);

module.exports = router;
