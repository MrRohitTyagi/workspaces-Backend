const express = require("express");
const router = express.Router();

const {
  createGroup,
  getOneGroup,
  getAllGroupsOfUser,
  saveGroupMessage,
  deleteGroup,
} = require("../controllers/groupController");

router.route("/create").post(createGroup);
router.route("/get-one-group/:id").get(getOneGroup);

router.route("/get-all-user-groups/:id").get(getAllGroupsOfUser);
router.route("/save-group-message").put(saveGroupMessage);
router.route("/delete/:id").put(deleteGroup);

module.exports = router;
