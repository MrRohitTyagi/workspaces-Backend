const express = require("express");

const {
  newChat,
  getAllChatsPeruser,
  saveMessages,
} = require("../controllers/chatController");
const router = express.Router();

router.route("/create").post(newChat);
router.route("/get-all-chats/:id").get(getAllChatsPeruser);
router.route("/save-message").post(saveMessages);

module.exports = router;
