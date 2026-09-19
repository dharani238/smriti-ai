import express from "express";
import mongoose from "mongoose";
import Patient from "../models/patient";

const router = express.Router();

// Create a patient
router.post("/", async (req, res) => {
  try {
    const { name, age, language, caregiverId } = req.body;

    const patient = await Patient.create({
      name,
      age,
      language,
      caregiverId,
    });

    res.status(201).json({
      success: true,
      message: "Patient created successfully",
      patient,
    });
  } catch (error) {
    console.error("Error creating patient:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create patient",
    });
  }
});

// Get all patients
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find();

    res.json({
      success: true,
      patients,
    });
  } catch (error) {
    console.error("Error fetching patients:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch patients",
    });
  }
});

// Get all patients belonging to one caregiver
router.get("/caregiver/:caregiverId", async (req, res) => {
  try {
    const { caregiverId } = req.params;

    const patients = await Patient.find({
      caregiverId,
    });

    res.json({
      success: true,
      patients,
    });
  } catch (error) {
    console.error("Error fetching caregiver patients:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch caregiver patients",
    });
  }
});

// Get one patient by ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID",
      });
    }

    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.json({
      success: true,
      patient,
    });
  } catch (error) {
    console.error("Error fetching patient:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch patient",
    });
  }
});

export default router;