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

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}));

app.use('/', authRoutes);
app.use('/', compilerRoutes);
app.use('/', draftRoutes);
app.use("/", submissionRoutes);
app.use("/", aiReviewRoutes);

const startServer = async () => {
  try {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`http://localhost:${port}`);
    });
    await connectDB();
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
};

startServer();