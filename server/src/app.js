import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import repoRoutes from "./routes/repo.routes.js";
import userRoutes from "./routes/user.routes.js";
import aiHealthRoutes from "./routes/aiHealth.routes.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import chatSessionRoutes from "./routes/chatSession.routes.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/repos", repoRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai-service", aiHealthRoutes);
app.use("/api/sessions", chatSessionRoutes);

app.use(notFoundHandler);
app.use(errorHandler);



export default app;