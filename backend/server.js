const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const ACTIONS = require("./Actions");
const cors = require("cors");
const server = http.createServer(app);
require("dotenv").config();

app.use(cors());

app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};
const roomCodeMap = {};

const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
};

io.on("connection", (socket) => {
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;

    socket.join(roomId);
    console.log("Socket connected", socket.id, roomId, username);
    const clients = getAllConnectedClients(roomId);

    // notify that new user join
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });

    // const currentCode = roomCodeMap[roomId];
    // io.to(socket.Id).emit(ACTIONS.SYNC_CODE, { code: currentCode });
  });

  // sync the code
  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    roomCodeMap[roomId] = code;
    console.log('codechange');
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  // const currentCode = roomCodeMap[roomId] || "";

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, roomId }) => {
    const currentCode = roomCodeMap[roomId];

    console.log("syncCode", { roomId, currentCode });
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, {code: currentCode})
    // io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code: code });
  });

  // leave room
  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    // leave all the room
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];
    socket.leave();
  });
});

// const PORT = process.env.PORT || 5000;
const PORT = 8000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
