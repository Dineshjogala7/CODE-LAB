const { Server } = require("socket.io");
const axios = require("axios");

let io;
const dotenv = require('dotenv')
// Store the latest code, language, and output per room
const roomData = {}; // { roomId: { code: "", language: "javascript", output: "" } }
const judgeApi = process.env.JUDGE_API
function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // frontend URL
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`🟢 New connection: ${socket.id}`);

    // ---------------- JOIN ROOM ----------------
    socket.on("join-room", (roomId, username) => {
      socket.join(roomId);
      socket.data.username = username;
      socket.data.roomId = roomId;
      console.log(`${username} joined room: ${roomId}`);

      // Initialize room data if not exists
      if (!roomData[roomId]) roomData[roomId] = { code: "", language: "python", output: "" };

      // Send the current code, language, and output to the new user
      socket.emit("sync-code", {
        code: roomData[roomId].code,
        language: roomData[roomId].language,
        output: roomData[roomId].output,
      });

      // Notify others in the room
      socket.to(roomId).emit("user-joined", {
        username,
        socketId: socket.id,
      });
    });

    // ---------------- CODE CHANGE ----------------
    socket.on("code-change", (roomId, newCode) => {
      if (roomData[roomId]) roomData[roomId].code = newCode;
      socket.to(roomId).emit("code-change", newCode);
    });

    // ---------------- LANGUAGE CHANGE ----------------
    socket.on("language-change", (roomId, newLanguage) => {
      if (roomData[roomId]) {
        roomData[roomId].language = newLanguage;
        console.log(`Room ${roomId} language changed to ${newLanguage} by ${socket.data.username}`);

        // Emit to everyone in the room, including sender
        io.to(roomId).emit("language-change", newLanguage);
      }
    });

    // ---------------- RUN CODE ----------------
    socket.on("run-code", async (roomId) => {
      const { code, language } = roomData[roomId];

      try {
        const payload = {
          source_code: code,
          language_id: getLanguageId(language),
          stdin: "",
          expected_output: "",
          cpu_time_limit: 2,
          memory_limit: 128000,
        };

        // Send the code to Judge0 API for execution
        const response = await axios.post(
          "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
              "X-RapidAPI-Key": `${judgeApi}`, 
            },
          }
        );

        const { stdout, stderr, status } = response.data;

        // Update room output
        if (roomData[roomId]) roomData[roomId].output = stdout || stderr;

        // Broadcast output to all users
        io.to(roomId).emit("run-code", { output: stdout || stderr, status: status.description });
      } catch (error) {
        console.error("Error executing code:", error);
        socket.emit("run-code", { output: "Error executing code", status: "error" });
      }
    });

    // ---------------- LEAVE ROOM ----------------
    socket.on("leave-room", () => {
      const roomId = socket.data.roomId;
      const username = socket.data.username;
      if (roomId) {
        socket.leave(roomId);
        console.log(`${username} left room: ${roomId}`);
        socket.to(roomId).emit("user-left", { username, socketId: socket.id });
      }
    });

    // ---------------- DISCONNECT ----------------
    socket.on("disconnect", () => {
      const roomId = socket.data.roomId;
      const username = socket.data.username;
      console.log(`🔴 Disconnected: ${socket.id} (${username || "unknown user"})`);

      if (roomId && username) {
        socket.to(roomId).emit("user-left", { username, socketId: socket.id });
      }
    });
  });
}

// Helper to get the io instance if needed elsewhere
function getIO() {
  if (!io) throw new Error("Socket.io has not been initialized yet!");
  return io;
}

// Map language name to Judge0 language ID
function getLanguageId(language) {
  const languageMap = {
    javascript: 63,
    python: 71,
    java: 62,
    c: 50,
    cpp: 54,
  };
  return languageMap[language.toLowerCase()] || 71; // Default to Python
}

module.exports = { initSocket, getIO };
