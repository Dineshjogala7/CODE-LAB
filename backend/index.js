const express = require("express");
const { createServer } = require("http");
const { initSocket, getIO } = require("./socketservers/socketServer");

const app = express();
const httpServer = createServer(app);
const dotenv = require('dotenv')
dotenv.config() 
// Initialize Socket.io with the HTTP server
initSocket(httpServer);
const io = getIO(); // (Optional — only needed if you plan to use io in this file)

httpServer.listen(3000, () => {
  console.log("✅ Server running on port 3000");
});
