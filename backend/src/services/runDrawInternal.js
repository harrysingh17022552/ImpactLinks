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
export const runDrawInternal = async (session) => {
  const now = new Date();

  // Prevent duplicate
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
    throw new Error("Draw already exists or in processing");
  }

  //  Run draw
  const { drawNumbers, eligibleUsers, drawId } = await runDrawFunc(session);

  if (eligibleUsers.length === 0) {
    await Draw.findByIdAndUpdate(drawId, { status: "skipped" }, { session });

    return {
      type: "SKIPPED",
      message: "No Eligible Participant",
    };
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

  //  Winners
  const winners = [];

  for (let { user, scores } of eligibleUsers) {
    const userNumbers = scores.map((s) => s.score);
    const matches = calculateMatches(userNumbers, drawNumbers);

    if (matches >= 3) {
      winners.push({
        userId: user._id,
        drawId,
        matchCount: matches,
        userScore: userNumbers,
      });
    }
  }

  await Winner.insertMany(winners, { session });

  //  Distribution
  const carryForward = await distributePrizes(drawId, split, session);

  await Pool.findByIdAndUpdate(
    pool[0]._id,
    { jackpotCarryForward: carryForward },
    { session },
  );

  await Draw.findByIdAndUpdate(drawId, { status: "completed" }, { session });

  return {
    type: "SUCCESS",
    drawNumbers,
    totalPool,
    carryForward,
  };
};
