import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import adminRouter from "./src/routes/admin.routes.js";
import mongoose from "mongoose";

const app = express();

// MongoDB connection handling
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    isConnected = true;
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

// Connect DB before handling requests
app.use(async (req, res, next) => {
  if (!isConnected) {
    await connectDB();
  }
  next();
});

// Allowed origins
const allowedOrigins = ["https://portfolio-frontend-psi-eight.vercel.app"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/admin", adminRouter);

// Root route
app.get("/", (req, res) => {
  res.send("API is running on Vercel...");
});

// ❗ Important: DO NOT use app.listen() — Vercel manages this automatically
// ❗ Export the app as default for Vercel Serverless Function
export default app;
