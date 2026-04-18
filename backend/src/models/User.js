import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    subscription: {
      plan: String,
      status: String,
      startDate: Date,
      endDate: Date,
    },
    charityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Charity",
    },

    charityPercentage: {
      type: Number,
      default: 10,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
