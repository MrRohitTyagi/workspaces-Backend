const express = require("express");
const {
  createEmail,
  deleteEmail,
  deleteEmailSent,
  updateEmail,
} = require("../controllers/emailController");
const router = express.Router();

router.route("/create").post(createEmail);
router.route("/delete/:id/:email").delete(deleteEmail);
router.route("/delete-sent/:id").delete(deleteEmailSent);
router.route("/update-email").put(updateEmail);

module.exports = router;
