import Winner from "../models/Winner.js";

export const distributePrizes = async (drawId, poolData, session) => {
  const winners = await Winner.find({ drawId }).session(session);

  const tier5Winners = winners.filter((w) => w.matchCount === 5);
  const tier4Winners = winners.filter((w) => w.matchCount === 4);
  const tier3Winners = winners.filter((w) => w.matchCount === 3);
  let carryForward = 0;
  // Tier 5 (Jackpot)
  if (tier5Winners.length > 0) {
    const share = poolData.tier5 / tier5Winners.length;

    for (let w of tier5Winners) {
      w.prizeAmount = share;
      await w.save();
    }
  } else {
    carryForward = poolData.tier5;
  }

  // Tier 4
  if (tier4Winners.length > 0) {
    const share = poolData.tier4 / tier4Winners.length;

    for (let w of tier4Winners) {
      w.prizeAmount = share;
      await w.save();
    }
  }

  // Tier 3
  if (tier3Winners.length > 0) {
    const share = poolData.tier3 / tier3Winners.length;

    for (let w of tier3Winners) {
      w.prizeAmount = share;
      await w.save();
    }
  }
  return carryForward;
};
