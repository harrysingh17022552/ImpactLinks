import mongoose from "mongoose";

const drawSchema = new mongoose.Schema(
  {
    numbers: {
      type: [Number], // 5 numbers
      required: true,
    },
    month: Number,
    year: Number,
    status: {
      type: String,
      enum: [
        "pending",
        "completed",
        "processing",
        "published",
        "failed",
        "skipped",
      ],
      default: "pending",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Draw", drawSchema);
