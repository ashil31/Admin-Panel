// backend/socketHandler.js
const { Server } = require("socket.io");

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "https://admin-panel-1-gjrv.onrender.com/", // You can restrict it to frontend URL in production
      methods: ["GET", "POST", "PATCH"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 A user connected:", socket.id);

    // Listen to events from frontend
    socket.on("disconnect", () => {
      console.log("🔴 A user disconnected:", socket.id);
    });
  });
}

function emitRewardUpdate(data) {
  if (io) {
    io.emit("rewardUpdated", data);
  }
}
function emitNewUser(data) {
  if (io) {
    io.emit("newUser", data);
  }
}
module.exports = {
  initSocket,
  emitRewardUpdate,
  emitNewUser,
};
