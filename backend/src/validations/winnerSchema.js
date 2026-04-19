import mongoose from "mongoose";
import { z } from "zod";
export const uploadProofSchema = z.object({
  winnerId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid MongoDB ObjectId",
  }),
  proofUrl: z.string().url("Invalid proof URL format"),
});

export const verifyWinnerSchema = z.object({
  winnerId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid winnerId format",
  }),
  status: z.enum(["approved", "rejected"], {
    errorMap: () => ({
      message: "Status must be either 'approved' or 'rejected'",
    }),
  }),
});
