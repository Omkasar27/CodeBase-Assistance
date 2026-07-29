import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { saveGithubTokenSchema } from "../validators/user.validator.js";
import {
  addGithubToken,
  deleteGithubToken,
  getGithubTokenStatus,
} from "../controllers/user.controller.js";

const router = Router();

router.use(protect);

router.post("/github-token", validate(saveGithubTokenSchema), addGithubToken);
router.delete("/github-token", deleteGithubToken);
router.get("/github-token/status", getGithubTokenStatus);

export default router;