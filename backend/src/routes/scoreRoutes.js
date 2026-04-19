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
import { subscriptionMiddleware } from "../middlewares/isActive.js";

const router = express.Router();

router.get("/", authMiddleware, getScores);
router.post(
  "/",
  authMiddleware,
  subscriptionMiddleware,
  validate(addScoreSchema),
  addScore,
);
router.put(
  "/:id",
  authMiddleware,
  subscriptionMiddleware,
  validate(validateOnlyScore),
  updateScore,
);
router.delete("/:id", authMiddleware, subscriptionMiddleware, deleteScore);
router.get(
  "/eligibility",
  authMiddleware,
  subscriptionMiddleware,
  getEligibility,
);

export default router;
