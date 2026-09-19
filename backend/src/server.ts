import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import patientRoutes from "./routes/patientRoutes";
import familyMemberRoutes from "./routes/familyMemberRoutes";
import memoryRoutes from "./routes/memoryRoutes";
import reminderRoutes from "./routes/reminderRoutes";
import gameSessionRoutes from "./routes/gameSessionRoutes";
import recommendationRoutes from "./routes/recommendationRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cors());

// Family photos are currently sent as Base64 data URLs.
// Increase the JSON body limit so images up to the
// frontend's 2 MB limit can be received safely.
app.use(
  express.json({
    limit: "5mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "5mb",
  })
);

// ======================================================
// ROUTES
// ======================================================

app.use("/api/patients", patientRoutes);

app.use(
  "/api/family",
  familyMemberRoutes
);

app.use(
  "/api/memories",
  memoryRoutes
);

app.use(
  "/api/reminders",
  reminderRoutes
);

app.use(
  "/api/game-sessions",
  gameSessionRoutes
);

app.use(
  "/api/recommendations",
  recommendationRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message:
      "Cognitive Memory Platform backend is running",
  });
});

// ======================================================
// DATABASE + SERVER
// ======================================================

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing");
}

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(MONGODB_URI);
  console.log("MongoDB connected successfully");
};

// Connect to MongoDB before handling API requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// Local development
if (process.env.VERCEL !== "1") {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error("MongoDB connection failed:", error);
      process.exit(1);
    });
}

// Export Express app for Vercel
export default app;