const express = require("express");
const {
  configureUser,
  createUser,
  getUser,
  updateUser,
} = require("../controllers/userController");
const router = express.Router();

router.route("/configure").post(configureUser);
router.route("/create").post(createUser);
router.route("/get").post(getUser);
router.route("/update").put(updateUser);

module.exports = router;
