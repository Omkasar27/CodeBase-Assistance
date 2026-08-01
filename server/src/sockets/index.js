import { Server } from "socket.io";
import { verifyToken } from "../utils/jwt.js";
import Repository from "../models/repository.model.js";
import { setIO } from "./socketManager.js";

export function initSocket(httpServer, env) {
  const io = new Server(httpServer, {
    cors: {
      origin: env.clientUrl,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error("Authentication required"));
      }
      const decoded = verifyToken(token);
      socket.userId = decoded.userId;
      next();
    } catch {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("join:repo", async (repoId) => {
      try {
        const repo = await Repository.findOne({ _id: repoId, owner: socket.userId });
        if (!repo) return; // silently ignore — don't leak whether the ID exists
        socket.join(`repo:${repoId}`);
      } catch {
        // ignore malformed IDs etc.
      }
    });

    socket.on("leave:repo", (repoId) => {
      socket.leave(`repo:${repoId}`);
    });
  });

  setIO(io);
  return io;
}