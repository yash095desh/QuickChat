import { Server } from "socket.io";
import { Server as HttpServer } from "http";

export const users: Record<string, string> = {}; // Store user {userId: socketId} mapping

export const initializeSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: [process.env.CLIENT_URL || "http://localhost:3000"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const { userId } = socket.handshake.auth;
    if (userId) {
      users[userId] = socket.id;
      console.log(`✅ User ${userId} connected with socket ID: ${socket.id}`);
    }

    // Join a group chat
    socket.on("joinGroup", (chatId) => {
      socket.join(chatId);
      console.log(`User ${socket.id} joined room: ${chatId}`);
    });

    // Leave a group chat
    socket.on("leaveGroup", (chatId) => {
      socket.leave(chatId);
      console.log(`User ${socket.id} left room: ${chatId}`);
    });

    // On disconnect, remove the mapping
    socket.on("disconnect", () => {
      delete users[userId];
    });
  });

  return io;
};
