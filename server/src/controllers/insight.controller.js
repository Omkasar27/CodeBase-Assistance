import { triggerAnalysis, getInsights } from "../services/insight.service.js";

export async function startAnalysis(req, res, next) {
  try {
    const insight = await triggerAnalysis(req.user.id, req.params.id);
    res.status(202).json({
      success: true,
      message: "Analysis started",
      data: { insight },
    });
  } catch (error) {
    next(error);
  }
}

export async function getRepositoryInsights(req, res, next) {
  try {
    const insight = await getInsights(req.user.id, req.params.id);
    res.status(200).json({ success: true, data: { insight } });
  } catch (error) {
    next(error);
  }
}