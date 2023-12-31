const express = require("express");
const {
  createEmail,
  deleteEmail,
  deleteEmailSent,
  updateEmail,
  getSingleEmail,
  searchEmails,
} = require("../controllers/emailController");
const router = express.Router();

router.route("/create").post(createEmail);
router.route("/delete/:id/:email").delete(deleteEmail);
router.route("/delete-sent/:id").delete(deleteEmailSent);
router.route("/update-email").put(updateEmail);
router.route("/get-email/:id").get(getSingleEmail);
router.route("/search").get(searchEmails);

module.exports = router;
