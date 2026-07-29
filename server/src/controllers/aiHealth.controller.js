import { checkAiServiceHealth } from "../services/aiServiceClient.js";

export async function getAiServiceHealth(req, res, next) {
  try {
    const health = await checkAiServiceHealth();

    res.status(200).json({
      success: true,
      data: health,
    });
  } catch (error) {
    next(error);
  }
}