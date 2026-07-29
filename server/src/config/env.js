import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
  "MONGODB_URI",
  "PORT",
  "CLIENT_URL",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
  "GITHUB_API_BASE_URL",
  "ENCRYPTION_KEY",
  "AI_SERVICE_URL",
  "INTERNAL_API_KEY",
];

function validateEnv() {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  if (process.env.ENCRYPTION_KEY.length !== 64) {
    throw new Error(
      "ENCRYPTION_KEY must be a 64-character hex string (32 bytes)"
    );
  }
}

validateEnv();

export const env = {
  port: process.env.PORT,
  mongodbUri: process.env.MONGODB_URI,
  clientUrl: process.env.CLIENT_URL,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  githubApiBaseUrl: process.env.GITHUB_API_BASE_URL,
  encryptionKey: process.env.ENCRYPTION_KEY,
  aiServiceUrl: process.env.AI_SERVICE_URL,
  internalApiKey: process.env.INTERNAL_API_KEY,
};