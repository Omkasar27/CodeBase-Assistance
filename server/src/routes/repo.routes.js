import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { connectRepoSchema } from "../validators/repo.validator.js";
import {
  createRepository,
  listRepositories,
  getRepository,
  removeRepository,
  triggerIndexing,
} from "../controllers/repo.controller.js";
import {
  createNewSession,
  getSessions,
} from "../controllers/chatSession.controller.js";
import { startAnalysis, getRepositoryInsights } from "../controllers/insight.controller.js";

const router = Router();

router.use(protect);

router.post("/", validate(connectRepoSchema), createRepository);
router.get("/", listRepositories);
router.get("/:id", getRepository);
router.delete("/:id", removeRepository);
router.post("/:id/index", triggerIndexing);
router.post("/:repoId/sessions", createNewSession);
router.get("/:repoId/sessions", getSessions);
router.post("/:id/analyze", startAnalysis);
router.get("/:id/insights", getRepositoryInsights);

export default router;