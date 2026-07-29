import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { getAiServiceHealth } from "../controllers/aiHealth.controller.js";

const router = Router();

router.get("/health", protect, getAiServiceHealth);

export default router;