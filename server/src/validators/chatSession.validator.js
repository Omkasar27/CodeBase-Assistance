import { z } from "zod";

export const renameSessionSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, "Title cannot be empty")
      .max(100, "Title is too long"),
  }),
});