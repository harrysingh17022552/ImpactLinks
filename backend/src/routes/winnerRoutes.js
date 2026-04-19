import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import {
  uploadProof,
  getMyWinnings,
  getAllWinners,
  verifyWinner,
  markAsPaid,
} from "../controllers/winnerController.js";
import { adminMiddleware } from "../middlewares/admin.js";
import validate from "../middlewares/validate.js";
import {
  uploadProofSchema,
  verifyWinnerSchema,
} from "../validations/winnerSchema.js";

const router = express.Router();

// user
router.post(
  "/upload-proof",
  authMiddleware,
  validate(uploadProofSchema),
  uploadProof,
);
router.get("/my", authMiddleware, getMyWinnings);
//admin
router.get("/admin/all", authMiddleware, adminMiddleware, getAllWinners);
router.post(
  "/admin/verify",
  authMiddleware,
  adminMiddleware,
  validate(verifyWinnerSchema),
  verifyWinner,
);
router.post("/admin/pay", authMiddleware, adminMiddleware, markAsPaid);

export default router;
