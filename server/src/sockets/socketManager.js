let ioInstance = null;

export function setIO(io) {
  ioInstance = io;
}

export function getIO() {
  if (!ioInstance) {
    throw new Error("Socket.IO has not been initialized yet.");
  }
  return ioInstance;
}