// backend/index.js
const http = require("http");
const app = require("./app");
const { initSocket } = require("./socket/socketHandler");

const server = http.createServer(app);
const connectDB = require("./config/db");
connectDB();

// Initialize Socket.IO
initSocket(server);



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
