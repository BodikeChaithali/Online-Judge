import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import authRoutes from './src/routes/authRoutes.js';
import connectDB from './src/database/db.js';
import cors from "cors";
import compilerRoutes from "./src/routes/compilerRoutes.js";
import draftRoutes from "./src/routes/draftRoutes.js";
import submissionRoutes from "./src/routes/submissionRoutes.js";
import aiReviewRoutes from "./src/routes/aiReviewRoutes.js";
import leaderboardRoutes from "./src/routes/leaderboardRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import problemRoutes from "./src/routes/problemRoutes.js";
import Submission from "./src/models/submissionModel.js";
import cookieParser from "cookie-parser";
import { verifyEmailTransport } from "./src/utils/sendEmail.js";

const app = express();
if (process.env.TRUST_PROXY) {
  app.set("trust proxy", Number(process.env.TRUST_PROXY));
}
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use('/', authRoutes);
app.use('/', compilerRoutes);
app.use('/', draftRoutes);
app.use("/", submissionRoutes);
app.use("/", aiReviewRoutes);
app.use("/", leaderboardRoutes);
app.use("/", profileRoutes);
app.use("/", problemRoutes);

const startServer = async () => {
  try {
    await connectDB();
    await Submission.updateMany(
      { status: "Running" },
      {
        status: "Internal Error",
        verdict: "Server restarted while judging. Please submit again.",
      },
    );
    void verifyEmailTransport();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
};

startServer();