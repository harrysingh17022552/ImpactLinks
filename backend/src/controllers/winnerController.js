import Winner from "../models/Winner.js";

export const uploadProof = async (req, res) => {
  const { winnerId, proofUrl } = req.body;
  const userId = req.user.id;

  const winner = await Winner.findById(winnerId);

  if (!winner) {
    return res.status(404).json({ message: "Winner not found" });
  }

  if (winner.userId.toString() !== userId) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  winner.proofUrl = proofUrl;
  winner.status = "pending";

  await winner.save();

  res.json({ message: "Proof uploaded, awaiting verification" });
};
export const getMyWinnings = async (req, res) => {
  const userId = req.user.id;

  const winnings = await Winner.find({ userId })
    .populate("drawId", "_id numbers month year status")
    .select(
      "_id userScore drawId matchCount prizeAmount status payoutStatus proofUrl createdAt",
    )
    .sort({ createdAt: -1 });

  res.json(winnings);
};
export const getAllWinners = async (req, res) => {
  const winners = await Winner.find()
    .populate("userId", "_id name email subscriptionStatus charityPercentage")
    .populate("drawId", "_id numbers month year status createdAt")
    .select(
      "_id userId userScore drawId matchCount prizeAmount status payoutStatus proofUrl",
    );
  res.json(winners);
};
export const verifyWinner = async (req, res) => {
  const { winnerId, status } = req.body; // approved / rejected

  const winner = await Winner.findById(winnerId);

  if (!winner) {
    return res.status(404).json({ message: "Not found" });
  }

  winner.status = status;

  await winner.save();

  res.json({ message: `Winner ${status}` });
};
export const markAsPaid = async (req, res) => {
  const { winnerId } = req.body;

  const winner = await Winner.findById(winnerId);

  if (!winner) {
    return res.status(404).json({ message: "Not found" });
  }

  if (winner.status !== "approved") {
    return res.status(400).json({ message: "Not approved yet" });
  }

  winner.payoutStatus = "paid";

  await winner.save();

  res.json({ message: "Payment completed" });
};
