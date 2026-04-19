import Score from "../models/Score.js";

export const addScore = async (req, res) => {
  const { score, date } = req.body;
  const userId = req.user.id;
  if (!date) {
    return res.status(400).json({ message: "Date required" });
  }

  const inputDate = new Date(date);
  const today = new Date();

  if (inputDate > today) {
    return res.status(400).json({ message: "Future date not allowed" });
  }
  if (inputDate < today) {
    return res.status(400).json({ message: "Past date not allowed" });
  }
  // validation
  if (score < 1 || score > 45) {
    return res.status(400).json({ message: "Invalid score" });
  }

  try {
    // insert
    await Score.create({ userId, score, date });

    // keep only latest 5
    const scores = await Score.find({ userId }).sort({ date: -1 });

    if (scores.length > 5) {
      const toDelete = scores.slice(5);
      const ids = toDelete.map((s) => s._id);

      await Score.deleteMany({ _id: { $in: ids } });
    }

    res.json({ message: "Score added" });
  } catch (err) {
    res.status(400).json({ message: "Duplicate date not allowed" });
  }
};

export const getScores = async (req, res) => {
  const userId = req.user.id;

  const scores = await Score.find({ userId }).sort({ date: -1 });

  res.json(scores);
};

export const updateScore = async (req, res) => {
  const { id } = req.params;
  const { score } = req.body;

  const existing = await Score.findById(id);

  if (!existing) {
    return res.status(404).json({ message: "Score not found" });
  }

  if (existing.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  // 24 hour rule
  const now = new Date();
  const createdAt = new Date(existing.createdAt);

  const diffHours = (now - createdAt) / (1000 * 60 * 60);

  if (diffHours > 24) {
    return res.status(400).json({
      message: "Edit window expired, you can edit score within same day",
    });
  }

  existing.score = score;
  await existing.save();

  res.json({ message: "Score updated" });
};

export const deleteScore = async (req, res) => {
  const { id } = req.params;

  const score = await Score.findById(id);

  if (!score) {
    return res.status(404).json({ message: "Not found" });
  }

  if (score.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  // 24 hour rule
  const now = new Date();
  const createdAt = new Date(score.createdAt);

  const diffHours = (now - createdAt) / (1000 * 60 * 60);

  if (diffHours > 24) {
    return res.status(400).json({
      message: "Delete window expired, you can delete score within same day",
    });
  }
  await score.deleteOne();

  res.json({ message: "Deleted successfully" });
};

export const getEligibility = async (req, res) => {
  const userId = req.user.id;

  const count = await Score.countDocuments({ userId });

  res.json({
    message:
      count === 5
        ? `You are Eligible for Draw, maintain 5 scores till end of month`
        : `Nopes you are not eligible because you requires 5 scores & currently you have ${count}`,
    eligible: count === 5,
    scoresCount: count,
    required: 5,
  });
};
