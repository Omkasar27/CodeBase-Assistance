import { z } from "zod";

export const connectRepoSchema = z.object({
  body: z.object({
    repoUrl: z
      .string()
      .min(1, "Repository URL is required")
      .max(500, "Repository URL is too long"),
  }),
});