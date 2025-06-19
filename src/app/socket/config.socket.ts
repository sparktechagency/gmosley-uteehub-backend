// socket.ts
import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import chatHandler from "./chat.socket";

let io: SocketIOServer;

const initSocket = (server: HTTPServer): SocketIOServer => {
  io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  console.log("Socket.io initialized");

  io.on("connection", (socket: Socket) => {
    console.log(`New connection: ${socket.id}`);
    chatHandler(io, socket);
  });

  return io;
};

export { initSocket };
