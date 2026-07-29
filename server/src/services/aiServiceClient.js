import axios from "axios";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

const aiServiceClient = axios.create({
  baseURL: env.aiServiceUrl,
  headers: {
    "X-Internal-Api-Key": env.internalApiKey,
  },
  timeout: 10000,
});

export async function checkAiServiceHealth() {
  try {
    const response = await aiServiceClient.get("/health/");
    return response.data;
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      throw new AppError("AI service is not reachable. Is it running?", 503);
    }
    if (error.response?.status === 401) {
      throw new AppError(
        "Internal API key mismatch between Node and Python services.",
        500
      );
    }
    throw new AppError("Failed to reach the AI service.", 502);
  }
}

export async function indexRepositoryChunks(repoId, files) {
  try {
    const response = await aiServiceClient.post(
      "/indexing/index",
      { repo_id: repoId, files },
      { timeout: 120000 }
    );
    return response.data;
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      throw new AppError("AI service is not reachable. Is it running?", 503);
    }
    if (error.response?.status === 401) {
      throw new AppError(
        "Internal API key mismatch between Node and Python services.",
        500
      );
    }
    throw new AppError(
      error.response?.data?.detail || "Failed to index repository.",
      502
    );
  }
}

export async function streamQuery({ repoId, question, chatHistory }) {
  try {
    const response = await aiServiceClient.post(
      "/query/",
      {
        repo_id: repoId,
        question,
        chat_history: chatHistory || [],
      },
      {
        responseType: "stream",
        timeout: 0, // streaming responses have no fixed duration
      }
    );
    return response.data; // a Node.js Readable stream
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      throw new AppError("AI service is not reachable. Is it running?", 503);
    }
    throw new AppError("Failed to start answer generation.", 502);
  }
}

export default aiServiceClient;