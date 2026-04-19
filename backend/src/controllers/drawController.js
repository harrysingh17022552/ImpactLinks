import Draw from "../models/Draw.js";
import Winner from "../models/Winner.js";
import User from "../models/User.js";
import Score from "../models/Score.js";
import Pool from "../models/Pool.js";
import {
  generateDrawNumbers,
  calculateMatches,
  runDrawFunc,
} from "../services/drawService.js";

import { calculatePool, splitPool } from "../services/poolService.js";
import { distributePrizes } from "../services/prizeService.js";
import mongoose from "mongoose";
import { runDrawInternal } from "../services/runDrawInternal.js";

export const runDraw = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await runDrawInternal(session);
    await session.commitTransaction();
    session.endSession();
    if (result.type === "SKIPPED") {
      return res.status(400).json({ message: result.message });
    }
    if (result.type === "SUCCESS") {
      return res.status(200).json({
        message: "Draw completed with prizes",
        ...result,
      });
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error("Transaction failed:", err);

    res.status(500).json({ message: err.message });
  }
};
export const getLatestDraw = async (req, res) => {
  const draw = await Draw.findOne().sort({ createdAt: -1 });

  res.json(draw);
};
export const getMyWinnings = async (req, res) => {
  const userId = req.user.id;

  const winnings = await Winner.find({ userId }).populate("drawId");

  res.json(winnings);
};
