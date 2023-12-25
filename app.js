const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const app = express();
app.use(express.json());
app.use(cors({ origin: "*", methods: "GET,HEAD,PUT,PATCH,POST,DELETE" }));
app.options("*", cors());

//routes import
const user = require("./Routes/userRoute.js");
const email = require("./Routes/emailRoutes.js");

app.use("/api/v1/user", user);
app.use("/api/v1/email", email);

module.exports = app;
