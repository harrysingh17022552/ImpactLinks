import { z } from "zod";

export const charitySchema = z.object({
  name: z.string().min(2, "Charity name is required"),
  description: z.string().min(10, "Description must be detailed"),
  imageUrl: z.string().url("A valid image URL is required"),
  contributionPct: z
    .number()
    .min(10, "Minimum contribution is 10%")
    .default(10),
});
