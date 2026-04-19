import mongoose from "mongoose";

const poolSchema = new mongoose.Schema(
  {
    drawId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Draw",
    },
    month: Number,
    year: Number,

    totalAmount: Number,
    jackpotCarryForward: {
      type: Number,
      default: 0,
    },

    tier5Amount: Number,
    tier4Amount: Number,
    tier3Amount: Number,
  },
  { timestamps: true },
);

export default mongoose.model("Pool", poolSchema);
