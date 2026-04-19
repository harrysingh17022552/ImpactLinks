import mongoose from "mongoose";

const winnerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    drawId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Draw",
    },
    matchCount: Number, // 3, 4, 5
    proofUrl: String,

    prizeAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    proofUrl: String,

    payoutStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Winner", winnerSchema);
