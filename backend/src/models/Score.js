import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  score: {
    type: Number,
    min: 1,
    max: 45
  },
  date: {
    type: Date,
    required: true
  }
}, { timestamps: true });

// prevent duplicate date per user
scoreSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model("Score", scoreSchema);