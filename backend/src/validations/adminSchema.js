import { z } from 'zod';

export const adminScoreUpdateSchema = z.object({
  scoreId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  newValue: z.number().int().min(1).max(45)
});

export const proofUploadSchema = z.object({
  winnerId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  proofUrl: z.string().url("Must be a valid URL to the screenshot")
});