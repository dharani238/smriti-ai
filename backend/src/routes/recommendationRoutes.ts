import express from "express";
import Recommendation from "../models/Recommendation";

const router = express.Router();

type Difficulty = "Easy" | "Medium" | "Hard";

const VALID_DIFFICULTIES: Difficulty[] = [
  "Easy",
  "Medium",
  "Hard",
];

/* =========================================================
   CREATE RECOMMENDATION
   POST /api/recommendations
   ========================================================= */

router.post("/", async (req, res) => {
  try {
    const {
      patientId,
      gameName,
      currentDifficulty,
      recommendedDifficulty,
      reason,
      accuracy,
    } = req.body;

    /* -----------------------------------------------------
       VALIDATION
       ----------------------------------------------------- */

    if (
      !patientId ||
      !gameName ||
      !currentDifficulty ||
      !recommendedDifficulty ||
      !reason ||
      accuracy === undefined ||
      accuracy === null
    ) {
      return res.status(400).json({
        success: false,
        message:
          "patientId, gameName, currentDifficulty, recommendedDifficulty, reason and accuracy are required",
      });
    }

    if (
      !VALID_DIFFICULTIES.includes(
        currentDifficulty as Difficulty
      ) ||
      !VALID_DIFFICULTIES.includes(
        recommendedDifficulty as Difficulty
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Difficulty must be Easy, Medium or Hard",
      });
    }

    const numericAccuracy = Number(accuracy);

    if (
      Number.isNaN(numericAccuracy) ||
      numericAccuracy < 0 ||
      numericAccuracy > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Accuracy must be a number between 0 and 100",
      });
    }

    /* -----------------------------------------------------
       CREATE RECOMMENDATION
       ----------------------------------------------------- */

    const recommendation =
      await Recommendation.create({
        patientId: String(patientId).trim(),

        gameName: String(gameName).trim(),

        currentDifficulty,

        recommendedDifficulty,

        reason: String(reason).trim(),

        accuracy: numericAccuracy,
      });

    return res.status(201).json({
      success: true,
      message:
        "Recommendation created successfully",
      recommendation,
    });
  } catch (error) {
    console.error(
      "Error creating recommendation:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create recommendation",
    });
  }
});

/* =========================================================
   GET ALL RECOMMENDATIONS FOR PATIENT
   GET /api/recommendations/:patientId
   ========================================================= */

router.get("/:patientId", async (req, res) => {
  try {
    const patientId =
      String(req.params.patientId).trim();

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message:
          "Patient ID is required",
      });
    }

    const recommendations =
      await Recommendation.find({
        patientId,
      })
        .sort({
          createdAt: -1,
        })
        .lean();

    return res.status(200).json({
      success: true,
      count: recommendations.length,
      recommendations,
    });
  } catch (error) {
    console.error(
      "Error fetching recommendations:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch recommendations",
    });
  }
});

/* =========================================================
   GET LATEST RECOMMENDATION FOR PATIENT
   GET /api/recommendations/:patientId/latest
   ========================================================= */

router.get(
  "/:patientId/latest",
  async (req, res) => {
    try {
      const patientId =
        String(
          req.params.patientId
        ).trim();

      if (!patientId) {
        return res.status(400).json({
          success: false,
          message:
            "Patient ID is required",
        });
      }

      const recommendation =
        await Recommendation.findOne({
          patientId,
        })
          .sort({
            createdAt: -1,
          })
          .lean();

      return res.status(200).json({
        success: true,
        recommendation:
          recommendation || null,
      });
    } catch (error) {
      console.error(
        "Error fetching latest recommendation:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch latest recommendation",
      });
    }
  }
);

/* =========================================================
   GET LATEST RECOMMENDATION FOR A PARTICULAR GAME
   GET /api/recommendations/:patientId/game/:gameName
   ========================================================= */

router.get(
  "/:patientId/game/:gameName",
  async (req, res) => {
    try {
      const patientId =
        String(
          req.params.patientId
        ).trim();

      const gameName =
        decodeURIComponent(
          String(
            req.params.gameName
          )
        ).trim();

      if (
        !patientId ||
        !gameName
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Patient ID and game name are required",
        });
      }

      const recommendation =
        await Recommendation.findOne({
          patientId,
          gameName,
        })
          .sort({
            createdAt: -1,
          })
          .lean();

      return res.status(200).json({
        success: true,
        recommendation:
          recommendation || null,
      });
    } catch (error) {
      console.error(
        "Error fetching game recommendation:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch game recommendation",
      });
    }
  }
);

export default router;