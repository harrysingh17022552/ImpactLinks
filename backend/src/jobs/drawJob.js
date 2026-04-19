import cron from "node-cron";
import mongoose from "mongoose";
import { runDrawInternal } from "../services/runDrawInternal.js";
export const startDrawJob = () => {
  cron.schedule("0 0 1 * *", async () => {
    console.log("⏳ Running draw cron...");

    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const result = await runDrawInternal(session);

      await session.commitTransaction();
      session.endSession();

      console.log("✅ Draw success:", result);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();

      console.error("❌ Draw failed:", err.message);
    }
  });
};
