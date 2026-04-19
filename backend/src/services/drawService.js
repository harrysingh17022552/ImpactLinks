import Draw from "../models/Draw.js";
import Score from "../models/Score.js";
import User from "../models/User.js";
const now = new Date();
export const generateDrawNumbers = async (session) => {
  const from_current_score = [
    44, 34, 21, 29, 2, 5, 22, 40, 36, 41, 21, 14, 32, 41, 29,
  ];
  //This is origina one
  //const numbers = new Set();
  // while (numbers.size < 5) {
  //   numbers.add(Math.floor(Math.random() * 45) + 1);
  // }

  //Remove this after testing
  let numbers = [];
  function getRandomScoresSet(scoreArray) {
    const shuffled = [...scoreArray].sort(() => 0.5 - Math.random());
    return new Set(shuffled.slice(0, 5));
  }
  numbers = getRandomScoresSet(from_current_score);
  const draw = await Draw.create(
    [
      {
        numbers: Array.from(numbers),
        month: now.getMonth(),
        year: now.getFullYear(),
        status: "pending",
      },
    ],
    { session },
  );
  return draw[0];
};
export const runDrawFunc = async (session) => {
  const draw = await generateDrawNumbers(session);
  if (!draw) return res.status(400).json({ message: "Failed to run Draw" });
  const drawNumbers = draw.numbers;
  await Draw.findByIdAndUpdate(
    draw._id,
    {
      status: "processing",
    },
    { session },
  );
  const users = await User.find({
    subscriptionStatus: "active",
    role: { $ne: "admin" },
  })
    .select("_id name email charityPercentage")
    .session(session)
    .lean();

  const eligibleUsers = [];
  const startOfMonth = new Date(draw.year, draw.month, 1);
  const endOfMonth = new Date(draw.year, draw.month + 1, 0, 23, 59, 59, 999);
  for (let user of users) {
    const scores = await Score.find({
      userId: user._id,
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    })
      .select("_id score date")
      .sort({ date: -1 })
      .limit(5)
      .lean();
    if (scores.length < 5) continue;

    eligibleUsers.push({
      user,
      scores,
    });
  }
  return { drawNumbers, eligibleUsers, drawId: draw._id };
};

export const calculateMatches = (userScores, drawNumbers) => {
  return userScores.filter((n) => drawNumbers.includes(n)).length;
};
