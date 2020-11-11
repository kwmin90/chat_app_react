import express from "express";
import socketio from "socket.io";
import http from "http";
import { User } from "./models/User";

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const users: User[] = [];
const PORT = process.env.PORT || 8080;
const ENV = "production";

io.on("connection", (socket) => {
  socket.on("username", (username: string) => {
    if (username) {
      const user = { id: socket.id, username: username };
      users.push(user);
      socket.emit("message", `Welcome to Chat App ${user.username}`);
      socket.broadcast.emit("message", `${user.username} has joined the chat`);
      const allUsers = [...users.map((user) => user.username)];
      io.emit("allUsers", allUsers);
    }
  });

  socket.on("message", (message: string) => {
    const user = users.find((user) => user.id === socket.id);
    if (user) {
      io.emit("message", `${user.username}: ${message}`);
    }
  });

  socket.on("disconnect", () => {
    const index = users.findIndex((user) => user.id === socket.id);
    if (index !== -1) {
      const user = users.splice(index, 1)[0];
      if (user) {
        io.emit("message", `${user.username} has left the chat`);
        const allUsers = [...users.map((user) => user.username)];
        io.emit("allUsers", allUsers);
      }
    }
  });
});

if (ENV === 'production') {
  app.use(express.static('client/build'));
}

server.listen(PORT, () => {
  console.log(`express server listening to port ${PORT}`);
});
