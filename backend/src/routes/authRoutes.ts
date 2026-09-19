import express from "express";
import mongoose from "mongoose";

import User from "../models/User";
import Patient from "../models/patient";

const router = express.Router();

// ======================================================
// REGISTER
// ======================================================

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      patientId,
    } = req.body;

    // --------------------------------------------------
    // BASIC VALIDATION
    // --------------------------------------------------

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, password and role are required",
      });
    }

    if (
      role !== "patient" &&
      role !== "caregiver"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    // --------------------------------------------------
    // CHECK EXISTING USER
    // --------------------------------------------------

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "An account with this email already exists",
      });
    }

    let linkedPatientId: string | undefined;

    // ==================================================
    // PATIENT REGISTRATION
    // ==================================================
    //
    // A patient must use the Patient ID created by
    // the caregiver.
    //
    // We DO NOT create another Patient record here.
    // ==================================================

    if (role === "patient") {
      if (!patientId || !patientId.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Please enter the Patient ID provided by your caregiver",
        });
      }

      const cleanPatientId = patientId.trim();

      // MongoDB ObjectId validation
      if (
        !mongoose.Types.ObjectId.isValid(
          cleanPatientId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "The Patient ID is not valid. Please check the ID provided by your caregiver.",
        });
      }

      // Check that caregiver-created patient exists
      const existingPatient =
        await Patient.findById(cleanPatientId);

      if (!existingPatient) {
        return res.status(404).json({
          success: false,
          message:
            "Patient profile was not found. Please check the Patient ID with your caregiver.",
        });
      }

      // Make sure another login account is not
      // already connected to this patient.
      const alreadyLinkedUser =
        await User.findOne({
          role: "patient",
          patientId: cleanPatientId,
        });

      if (alreadyLinkedUser) {
        return res.status(400).json({
          success: false,
          message:
            "This Patient ID is already connected to a patient account.",
        });
      }

      linkedPatientId = cleanPatientId;
    }

    // ==================================================
    // CREATE USER ACCOUNT
    // ==================================================

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role,
      patientId: linkedPatientId,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        patientId: user.patientId,
      },
    });
  } catch (error) {
    console.error(
      "Error registering user:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to register user",
    });
  }
});

// ======================================================
// LOGIN
// ======================================================

router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (
      !user ||
      user.password !== password
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    // ==================================================
    // REPAIR LEGACY PATIENT ACCOUNTS
    // ==================================================
    //
    // This section is only for older accounts created
    // before caregiver/patient linking was introduced.
    //
    // New patient registrations MUST use the Patient ID
    // supplied by their caregiver.
    // ==================================================

    if (user.role === "patient") {
      let patientExists = false;

      if (
        user.patientId &&
        mongoose.Types.ObjectId.isValid(
          user.patientId
        )
      ) {
        const existingPatient =
          await Patient.findById(
            user.patientId
          );

        patientExists = Boolean(
          existingPatient
        );
      }

      // Only repair an old account if its patient link
      // is missing or points to a non-existing patient.
      if (!patientExists) {
        const legacyPatient =
          await Patient.create({
            name: user.name,
            age: 0,
            language: "English",
          });

        user.patientId =
          legacyPatient._id.toString();

        await user.save();
      }
    }

    return res.json({
      success: true,
      message: "Login successful",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        patientId: user.patientId,
      },
    });
  } catch (error) {
    console.error(
      "Error logging in:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});

export default router;