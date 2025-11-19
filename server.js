import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import adminRouter from "./src/routes/admin.routes.js";
import connectCloudinary from "./src/config/connectCloudinary.js";
import connectDB from "./src/config/connectDB.js";

// Connect DB + Cloudinary
await connectDB();
await connectCloudinary();

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://portfolio-ti1s.onrender.com",
];

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

// API Routes
app.use("/api/admin", adminRouter);

app.use("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
