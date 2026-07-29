import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { renameSessionSchema } from "../validators/chatSession.validator.js";
import { queryRepoSchema } from "../validators/query.validator.js";
import {
  updateSessionTitle,
  removeSession,
  getMessages,
} from "../controllers/chatSession.controller.js";
import { askSession, regenerateSession } from "../controllers/query.controller.js";

const router = Router();

router.use(protect);

router.patch("/:sessionId", validate(renameSessionSchema), updateSessionTitle);
router.delete("/:sessionId", removeSession);
router.get("/:sessionId/messages", getMessages);
router.post("/:sessionId/query", validate(queryRepoSchema), askSession);
router.post("/:sessionId/regenerate", regenerateSession);

export default router;