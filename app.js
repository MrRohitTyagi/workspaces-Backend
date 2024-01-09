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

var console = require("better-console");

const httpServer = createServer(app);
const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);
  io.to(socket.id).emit("CONNECTED", socket.id);

  // Handle disconnection
  socket.on("disconnect", (id) => {
    console.log("User disconnected", socket.id);
  });
  socket.on("SAVE_SOCKET_ID", (id) => {
    console.info("id", id, socket.id);
    if (id) setUserSocketID(id, socket.id);
  });
  socket.on("USER_TYPING", ({ chattingTo, chat_id }) => {
    const chatting_with_socket_id = getUserSocketId(chattingTo);
    io.to(chatting_with_socket_id).emit("SHOW_TYPING_EFFECT", {
      chat_id,
      chattingTo,
    });
  });
});

//routes import
module.exports = { httpServer, io };

const user = require("./Routes/userRoute.js");
const email = require("./Routes/emailRoutes.js");
const chat = require("./Routes/chatRoutes.js");
const { setUserSocketID, getUserSocketId } = require("./config/globalState.js");

app.use("/api/v1/user", user);
app.use("/api/v1/email", email);
app.use("/api/v1/chat", chat);

app.use("/api/v1/getting-started", (req, res) => {
  res.send({ success: true });
});
