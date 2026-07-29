import { z } from "zod";

export const saveGithubTokenSchema = z.object({
  body: z.object({
    token: z
      .string()
      .min(10, "That doesn't look like a valid GitHub token")
      .max(255, "Token is too long"),
  }),
});