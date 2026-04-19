import { z } from "zod";
export const addScoreSchema = z.object({
  score: z
    .number()
    .int()
    .min(1, "Score must be at least 1")
    .max(45, "Score cannot exceed 45"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
});
export const validateOnlyScore = z.object({
  score: z
    .number()
    .int()
    .min(1, "Score must be at least 1")
    .max(45, "Score cannot exceed 45"),
});
