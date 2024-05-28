const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5500",
    methods: ["GET", "POST"],
  },
});
app.use(express.static(path.join(__dirname, "..", "scripts")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
    socket.emit("yourRoomId", roomId);
  });

  socket.on("sendMessage", ({ message, roomId }) => {
    io.to(roomId).emit("message", {message, roomId});
    console.log(`Message sent to room ${roomId}: ${message}`);
    socket.broadcast.to(roomId).emit("connectedRoomId", roomId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
