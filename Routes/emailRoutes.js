const express = require("express");
const { createEmail, deleteEmail } = require("../controllers/emailController");
const router = express.Router();

router.route("/create").post(createEmail);
router.route("/delete/:id/:email").delete(deleteEmail);

module.exports = router;
