import express from "express";
import {
  addScore,
  deleteScore,
  getEligibility,
  getScores,
  updateScore,
} from "../controllers/scoreController.js";
import { authMiddleware } from "../middlewares/auth.js";
import validate from "../middlewares/validate.js";
import {
  addScoreSchema,
  validateOnlyScore,
} from "../validations/scoreSchema.js";

const router = express.Router();

router.get("/", authMiddleware, getScores);
router.post("/", authMiddleware, validate(addScoreSchema), addScore);
router.put("/:id", authMiddleware, validate(validateOnlyScore), updateScore);
router.delete("/:id", authMiddleware, deleteScore);
router.get("/eligibility", authMiddleware, getEligibility);

export default router;
