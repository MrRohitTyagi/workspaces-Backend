const express = require("express");
const router = express.Router();

const {
  createGroup,
  getOneGroup,
  getAllGroupsOfUser,
  saveGroupMessage,
} = require("../controllers/groupController");

router.route("/create").post(createGroup);
router.route("/get-one-group/:id").get(getOneGroup);

router.route("/get-all-user-groups/:id").get(getAllGroupsOfUser);
router.route("/save-group-message").put(saveGroupMessage);

module.exports = router;
