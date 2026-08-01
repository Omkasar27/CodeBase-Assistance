import { io } from "socket.io-client";

let socket = null;

export function getSocket() {
  if (!socket) {
    const token = localStorage.getItem("token");
    const socketUrl = import.meta.env.VITE_API_BASE_URL.replace("/api", "");

    socket = io(socketUrl, {
      auth: { token },
      autoConnect: false,
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}