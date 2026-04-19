import express from "express";
import {
  runDraw,
  getLatestDraw,
  getMyWinnings,
} from "../controllers/drawController.js";
import { authMiddleware } from "../middlewares/auth.js";
import { adminMiddleware } from "../middlewares/admin.js";

const router = express.Router();

// admin only
router.post("/run", authMiddleware, adminMiddleware, runDraw);

router.get("/latest", getLatestDraw);

router.get("/winnings", authMiddleware, getMyWinnings);

export default router;
