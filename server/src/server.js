import http from "http";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { initSocket } from "./sockets/index.js";

async function startServer() {
  await connectDB();

  const httpServer = http.createServer(app);
  initSocket(httpServer, env);

  httpServer.listen(env.port, () => {
    console.log(`🚀 Server running on http://localhost:${env.port}`);
  });
}

startServer();