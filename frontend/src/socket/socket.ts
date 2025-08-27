// socket/socket.js
import { io } from "socket.io-client";

// Singleton socket instance
const URL = import.meta.env.VITE_BACKEND_URL || "https://admin-panel-snq4.onrender.com";
const socket = io(URL, {
  withCredentials: true,
  autoConnect: true, // ensures it's ready for real-time updates
  // transports: ["websocket"], // optional: forces WebSocket
});

socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});
socket.on("connect_error", (err) => {
  console.error("❌ Socket connect_error:", err.message, err);
});
socket.on("error", (err) => {
  console.error("❌ Socket error:", err);
});

export default socket;
