const express = require("express");
const {
  configureUser,
  createProduct,
} = require("../controllers/userController");
const router = express.Router();

router.route("/configure").post(configureUser);

  module.exports = router;
