const express = require("express");
const router = express.Router();

const {
  createGroup,
  getOneGroup,
  getAllGroupsOfUser,
  saveGroupMessage,
  deleteGroup,
  updateOneGroup,
  deleteSingleMessage,
} = require("../controllers/groupController");

router.route("/create").post(createGroup);
router.route("/get-one-group/:id").get(getOneGroup);

router.route("/get-all-user-groups/:id").get(getAllGroupsOfUser);
router.route("/save-group-message").put(saveGroupMessage);
router.route("/delete/:id").delete(deleteGroup);
router.route("/update").put(updateOneGroup);
router.route("/delete-singel-message").put(deleteSingleMessage);

module.exports = router;
