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

export const runDraw = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const now = new Date();

    // Prevent duplicate draw (inside transaction)
    const existing = await Draw.findOne(
      {
        month: now.getMonth(),
        year: now.getFullYear(),
        status: { $ne: "failed" },
      },
      null,
      { session },
    );

    if (existing) {
      return res
        .status(403)
        .json({ message: "Draw already exists or in processing" });
    }

    // Run draw
    const { drawNumbers, eligibleUsers, drawId } = await runDrawFunc(session);
    if (eligibleUsers.length == 0) {
      await Draw.findByIdAndUpdate(
        drawId,
        {
          status: "skipped",
        },
        { session },
      );
      await session.commitTransaction();
      session.endSession();
      return res.status(400).json({ message: "No Eligible Participant" });
    }
    // Pool
    const prevPool = await Pool.findOne({}, null, { session }).sort({
      createdAt: -1,
    });

    const { totalPool } = await calculatePool(
      eligibleUsers.length,
      prevPool?.jackpotCarryForward || 0,
    );

    const split = splitPool(totalPool);

    const pool = await Pool.create(
      [
        {
          drawId, //TODO:Make it unique later so that only one poll ref to draw
          month: now.getMonth(),
          year: now.getFullYear(),
          totalAmount: totalPool,
          jackpotCarryForward: 0,
          tier5Amount: split.tier5,
          tier4Amount: split.tier4,
          tier3Amount: split.tier3,
        },
      ],
      { session },
    );

    // Winners
    const winners = [];

    for (let { user, scores } of eligibleUsers) {
      const userNumbers = scores.map((s) => s.score);
      console.log("user number", userNumbers);
      const matches = calculateMatches(userNumbers, drawNumbers);

      if (matches >= 3) {
        winners.push({
          userId: user._id,
          drawId,
          matchCount: matches,
        });
      }
    }
    console.log(winners);
    await Winner.insertMany(winners, { session });

    // Distribute prizes (must also use session inside)
    const carryForward = await distributePrizes(drawId, split, session);

    // 🔄 Update pool
    await Pool.findByIdAndUpdate(
      pool[0]._id,
      { jackpotCarryForward: carryForward },
      { session },
    );
    await Draw.findByIdAndUpdate(
      drawId,
      {
        status: "completed",
      },
      { session },
    );
    // ✅ Commit
    await session.commitTransaction();
    session.endSession();

    res.json({
      message: "Draw completed with prizes",
      drawNumbers,
      totalPool,
      carryForward,
    });
  } catch (err) {
    //  Rollback everything
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction failed:", err);
    res.status(500).json({ message: "Internal server error" });
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
