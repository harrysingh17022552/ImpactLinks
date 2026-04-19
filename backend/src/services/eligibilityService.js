import Score from "../models/Score.js";

export const checkEligibility = async (userId) => {
  const scores = await Score.find({ userId });

  return {
    eligible: scores.length === 5,
    count: scores.length
  };
};