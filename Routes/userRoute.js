const express = require("express");
const {
  configureUser,
  createUser,
  getUser,
} = require("../controllers/userController");
const router = express.Router();

router.route("/configure").post(configureUser);
router.route("/create").post(createUser);
router.route("/get").post(getUser);

module.exports = router;
