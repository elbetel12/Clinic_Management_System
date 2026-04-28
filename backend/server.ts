import express from 'express';
import dotenv from 'dotenv';
import { connectToMongoDB } from './src/config/mongodb';
import app from './src/app';
dotenv.config();

app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, async() => {
  console.log(`Express server running at http://localhost:${PORT}`);
  await connectToMongoDB();
});