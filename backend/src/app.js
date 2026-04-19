import express from "express";
import { configDotenv } from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import scoreRoutes from "./routes/scoreRoutes.js";
import drawRoutes from "./routes/drawRoutes.js";
import winnerRoutes from "./routes/winnerRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";

configDotenv();

const app = express();
app.use(
  "/api/webhook",
  bodyParser.raw({ type: "application/json" }),
  webhookRoutes,
);
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/draw", drawRoutes);
app.use("/api/winners", winnerRoutes);
app.use("/api/payment", paymentRoutes);
app.get("/", (req, res) => {
  res.send("API Running...");
});

export default app;
