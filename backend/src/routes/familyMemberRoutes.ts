import express from "express";
import mongoose from "mongoose";
import FamilyMember from "../models/FamilyMember";

const router = express.Router();

/* =====================================================
   ADD FAMILY MEMBER
===================================================== */

router.post("/", async (req, res) => {
  try {
    const {
      patientId,
      name,
      relationship,
      age,
      photo,
    } = req.body;

    if (!patientId || !name || !relationship) {
      return res.status(400).json({
        success: false,
        message:
          "Patient ID, name and relationship are required.",
      });
    }

    const parsedAge =
      age === undefined ||
      age === null ||
      age === ""
        ? undefined
        : Number(age);

    if (
      parsedAge !== undefined &&
      (Number.isNaN(parsedAge) ||
        parsedAge <= 0 ||
        parsedAge > 120)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid age.",
      });
    }

    const familyMember =
      await FamilyMember.create({
        patientId: String(patientId).trim(),
        name: String(name).trim(),
        relationship: String(
          relationship
        ).trim(),
        age: parsedAge,
        photo: photo || undefined,
      });

    return res.status(201).json({
      success: true,
      message:
        "Family member created successfully.",
      familyMember,
    });
  } catch (error) {
    console.error(
      "Error creating family member:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create family member.",
    });
  }
});

/* =====================================================
   GET FAMILY MEMBERS FOR PATIENT
===================================================== */

router.get("/:patientId", async (req, res) => {
  try {
    const familyMembers =
      await FamilyMember.find({
        patientId: req.params.patientId,
      }).sort({
        createdAt: -1,
      });

    return res.json({
      success: true,
      familyMembers,
    });
  } catch (error) {
    console.error(
      "Error fetching family members:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch family members.",
    });
  }
});

/* =====================================================
   UPDATE FAMILY MEMBER
===================================================== */

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid family member ID.",
      });
    }

    const existing =
      await FamilyMember.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message:
          "Family member not found.",
      });
    }

    const {
      patientId,
      name,
      relationship,
      age,
      photo,
    } = req.body;

    /*
      If patientId is provided, it must match
      the record's current patient.

      This prevents an edit operation from
      accidentally moving a family member
      to another patient.
    */
    if (
      patientId &&
      String(patientId) !==
        existing.patientId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Patient ID does not match this family member.",
      });
    }

    if (
      name !== undefined &&
      !String(name).trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Name cannot be empty.",
      });
    }

    if (
      relationship !== undefined &&
      !String(relationship).trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Relationship cannot be empty.",
      });
    }

    if (age !== undefined) {
      if (age === "" || age === null) {
        existing.age = undefined;
      } else {
        const parsedAge = Number(age);

        if (
          Number.isNaN(parsedAge) ||
          parsedAge <= 0 ||
          parsedAge > 120
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Please enter a valid age.",
          });
        }

        existing.age = parsedAge;
      }
    }

    if (name !== undefined) {
      existing.name = String(name).trim();
    }

    if (relationship !== undefined) {
      existing.relationship = String(
        relationship
      ).trim();
    }

    if (photo !== undefined) {
      existing.photo = photo || undefined;
    }

    await existing.save();

    return res.json({
      success: true,
      message:
        "Family member updated successfully.",
      familyMember: existing,
    });
  } catch (error) {
    console.error(
      "Error updating family member:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update family member.",
    });
  }
});

/* =====================================================
   DELETE FAMILY MEMBER
===================================================== */

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid family member ID.",
      });
    }

    const familyMember =
      await FamilyMember.findById(id);

    if (!familyMember) {
      return res.status(404).json({
        success: false,
        message:
          "Family member not found.",
      });
    }

    await familyMember.deleteOne();

    return res.json({
      success: true,
      message:
        "Family member removed successfully.",
    });
  } catch (error) {
    console.error(
      "Error deleting family member:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete family member.",
    });
  }
});

export default router;