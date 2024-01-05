const express = require("express");

const {
  newChat,
  getAllChatsPeruser,
} = require("../controllers/chatController");
const router = express.Router();

router.route("/create").post(newChat);
router.route("/get-all-chats/:id").get(getAllChatsPeruser);

module.exports = router;
