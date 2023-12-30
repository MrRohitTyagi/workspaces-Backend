const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const app = express();
app.use(express.json());
app.use(cors({ origin: true, methods: "GET,HEAD,PUT,PATCH,POST,DELETE" }));
app.options("*", cors());

const httpServer = createServer(app);
const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);
  io.to(socket.id).emit("CONNECTED", socket.id);

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

//routes import
module.exports = { httpServer, io };

const user = require("./Routes/userRoute.js");
const email = require("./Routes/emailRoutes.js");

app.use("/api/v1/user", user);
app.use("/api/v1/email", email);

app.use("/api/v1/getting-started", (req, res) => {
  res.send({ success: true });
});
