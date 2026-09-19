import express from "express";
import GameSession from "../models/GameSession";

const router = express.Router();

// Add a game session
router.post("/", async (req, res) => {
  try {
    const {
      patientId,
      gameName,
      score,
      totalQuestions,
      accuracy,
      difficulty,
    } = req.body;

    const gameSession = await GameSession.create({
      patientId,
      gameName,
      score,
      totalQuestions,
      accuracy,
      difficulty,
    });

    res.status(201).json({
      success: true,
      message: "Game session created successfully",
      gameSession,
    });
  } catch (error) {
    console.error("Error creating game session:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create game session",
    });
  }
});

// Get game sessions for a patient
router.get("/:patientId", async (req, res) => {
  try {
    const gameSessions = await GameSession.find({
      patientId: req.params.patientId,
    }).sort({ playedAt: -1 });

    res.json({
      success: true,
      gameSessions,
    });
  } catch (error) {
    console.error("Error fetching game sessions:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch game sessions",
    });
  }
});

export default router;