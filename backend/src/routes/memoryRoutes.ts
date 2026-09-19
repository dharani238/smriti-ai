import express from "express";
import mongoose from "mongoose";
import Memory from "../models/Memory";

const router = express.Router();

/* =====================================================
   ADD MEMORY
===================================================== */

router.post("/", async (req, res) => {
  try {
    const {
      patientId,
      title,
      description,
      category,
      photo,
    } = req.body;

    if (
      !patientId ||
      !title ||
      !description ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Patient ID, title, description and category are required.",
      });
    }

    const memory = await Memory.create({
      patientId: String(patientId).trim(),
      title: String(title).trim(),
      description: String(
        description
      ).trim(),
      category: String(category).trim(),
      photo: photo || undefined,
    });

    return res.status(201).json({
      success: true,
      message:
        "Memory created successfully.",
      memory,
    });
  } catch (error) {
    console.error(
      "Error creating memory:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create memory.",
    });
  }
});

/* =====================================================
   GET MEMORIES FOR PATIENT
===================================================== */

router.get("/:patientId", async (req, res) => {
  try {
    const memories = await Memory.find({
      patientId: req.params.patientId,
    }).sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      memories,
    });
  } catch (error) {
    console.error(
      "Error fetching memories:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch memories.",
    });
  }
});

/* =====================================================
   UPDATE MEMORY
===================================================== */

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid memory ID.",
      });
    }

    const existing =
      await Memory.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Memory not found.",
      });
    }

    const {
      patientId,
      title,
      description,
      category,
      photo,
    } = req.body;

    /*
      Do not allow an edit operation to move
      a memory to another patient.
    */
    if (
      patientId &&
      String(patientId) !==
        existing.patientId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Patient ID does not match this memory.",
      });
    }

    if (
      title !== undefined &&
      !String(title).trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Title cannot be empty.",
      });
    }

    if (
      description !== undefined &&
      !String(description).trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Description cannot be empty.",
      });
    }

    if (
      category !== undefined &&
      !String(category).trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Category cannot be empty.",
      });
    }

    if (title !== undefined) {
      existing.title =
        String(title).trim();
    }

    if (description !== undefined) {
      existing.description = String(
        description
      ).trim();
    }

    if (category !== undefined) {
      existing.category = String(
        category
      ).trim();
    }

    if (photo !== undefined) {
      existing.photo = photo || undefined;
    }

    await existing.save();

    return res.json({
      success: true,
      message:
        "Memory updated successfully.",
      memory: existing,
    });
  } catch (error) {
    console.error(
      "Error updating memory:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update memory.",
    });
  }
});

/* =====================================================
   DELETE MEMORY
===================================================== */

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid memory ID.",
      });
    }

    const memory = await Memory.findById(id);

    if (!memory) {
      return res.status(404).json({
        success: false,
        message: "Memory not found.",
      });
    }

    await memory.deleteOne();

    return res.json({
      success: true,
      message:
        "Memory removed successfully.",
    });
  } catch (error) {
    console.error(
      "Error deleting memory:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete memory.",
    });
  }
});

export default router;