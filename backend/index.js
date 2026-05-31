import express from 'express';
import authRoutes from './src/routes/authRoutes.js';
import dotenv from 'dotenv';
import connectDB from './src/database/db.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

connectDB();

app.use('/', authRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`http://localhost:${port}`);
});