import express from "express";
import mongoose from "mongoose";

import Reminder from "../models/Reminder";

const router = express.Router();

/* =====================================================
   CREATE REMINDER
===================================================== */

router.post("/", async (req, res) => {
  try {
    const {
      patientId,
      title,
      description,
      date,
      time,
    } = req.body;

    if (
      !patientId ||
      !String(patientId).trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required.",
      });
    }

    if (!title || !String(title).trim()) {
      return res.status(400).json({
        success: false,
        message: "Reminder title is required.",
      });
    }

    if (!date || !String(date).trim()) {
      return res.status(400).json({
        success: false,
        message: "Reminder date is required.",
      });
    }

    if (!time || !String(time).trim()) {
      return res.status(400).json({
        success: false,
        message: "Reminder time is required.",
      });
    }

    const reminder =
      await Reminder.create({
        patientId: String(
          patientId
        ).trim(),

        title: String(title).trim(),

        description: description
          ? String(description).trim()
          : undefined,

        date: String(date).trim(),

        time: String(time).trim(),

        status: "pending",
      });

    return res.status(201).json({
      success: true,
      message:
        "Reminder created successfully.",
      reminder,
    });
  } catch (error) {
    console.error(
      "Error creating reminder:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create reminder.",
    });
  }
});

/* =====================================================
   GET REMINDERS FOR PATIENT
===================================================== */

router.get(
  "/:patientId",
  async (req, res) => {
    try {
      const reminders =
        await Reminder.find({
          patientId:
            req.params.patientId,
        }).sort({
          date: 1,
          time: 1,
          createdAt: -1,
        });

      return res.json({
        success: true,
        reminders,
      });
    } catch (error) {
      console.error(
        "Error fetching reminders:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch reminders.",
      });
    }
  }
);

/* =====================================================
   UPDATE REMINDER
   CAREGIVER EDIT
===================================================== */

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid reminder ID.",
      });
    }

    const reminder =
      await Reminder.findById(id);

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message:
          "Reminder not found.",
      });
    }

    const {
      patientId,
      title,
      description,
      date,
      time,
    } = req.body;

    /*
      Prevent an edit operation from
      moving the reminder to another
      patient.
    */

    if (
      patientId &&
      String(patientId).trim() !==
        reminder.patientId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Patient ID does not match this reminder.",
      });
    }

    if (
      title !== undefined &&
      !String(title).trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Reminder title cannot be empty.",
      });
    }

    if (
      date !== undefined &&
      !String(date).trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Reminder date cannot be empty.",
      });
    }

    if (
      time !== undefined &&
      !String(time).trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Reminder time cannot be empty.",
      });
    }

    if (title !== undefined) {
      reminder.title =
        String(title).trim();
    }

    if (description !== undefined) {
      reminder.description =
        description
          ? String(description).trim()
          : undefined;
    }

    if (date !== undefined) {
      reminder.date =
        String(date).trim();
    }

    if (time !== undefined) {
      reminder.time =
        String(time).trim();
    }

    await reminder.save();

    return res.json({
      success: true,
      message:
        "Reminder updated successfully.",
      reminder,
    });
  } catch (error) {
    console.error(
      "Error updating reminder:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update reminder.",
    });
  }
});

/* =====================================================
   DELETE REMINDER
   CAREGIVER DELETE
===================================================== */

router.delete(
  "/:id",
  async (req, res) => {
    try {
      const { id } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid reminder ID.",
        });
      }

      const reminder =
        await Reminder.findById(id);

      if (!reminder) {
        return res.status(404).json({
          success: false,
          message:
            "Reminder not found.",
        });
      }

      await reminder.deleteOne();

      return res.json({
        success: true,
        message:
          "Reminder deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Error deleting reminder:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete reminder.",
      });
    }
  }
);

/* =====================================================
   PATIENT MARKS REMINDER COMPLETED
===================================================== */

router.patch(
  "/:id/complete",
  async (req, res) => {
    try {
      const { id } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid reminder ID.",
        });
      }

      const reminder =
        await Reminder.findById(id);

      if (!reminder) {
        return res.status(404).json({
          success: false,
          message:
            "Reminder not found.",
        });
      }

      reminder.status = "completed";

      reminder.completedAt =
        new Date();

      reminder.snoozedUntil =
        undefined;

      await reminder.save();

      return res.json({
        success: true,
        message:
          "Reminder marked as completed.",
        reminder,
      });
    } catch (error) {
      console.error(
        "Error completing reminder:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to complete reminder.",
      });
    }
  }
);

/* =====================================================
   PATIENT SNOOZES REMINDER
===================================================== */

router.patch(
  "/:id/snooze",
  async (req, res) => {
    try {
      const { id } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid reminder ID.",
        });
      }

      const reminder =
        await Reminder.findById(id);

      if (!reminder) {
        return res.status(404).json({
          success: false,
          message:
            "Reminder not found.",
        });
      }

      /*
        Default snooze duration:
        10 minutes.
      */

      const requestedMinutes =
        Number(req.body?.minutes);

      const snoozeMinutes =
        Number.isFinite(
          requestedMinutes
        ) &&
        requestedMinutes > 0 &&
        requestedMinutes <= 1440
          ? requestedMinutes
          : 10;

      const snoozedUntil =
        new Date(
          Date.now() +
            snoozeMinutes *
              60 *
              1000
        );

      reminder.status =
        "snoozed";

      reminder.snoozedUntil =
        snoozedUntil;

      reminder.completedAt =
        undefined;

      await reminder.save();

      return res.json({
        success: true,
        message: `Reminder snoozed for ${snoozeMinutes} minutes.`,
        reminder,
      });
    } catch (error) {
      console.error(
        "Error snoozing reminder:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to snooze reminder.",
      });
    }
  }
);

/* =====================================================
   RESET REMINDER TO PENDING
   CAREGIVER CAN REOPEN IT
===================================================== */

router.patch(
  "/:id/pending",
  async (req, res) => {
    try {
      const { id } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid reminder ID.",
        });
      }

      const reminder =
        await Reminder.findById(id);

      if (!reminder) {
        return res.status(404).json({
          success: false,
          message:
            "Reminder not found.",
        });
      }

      reminder.status =
        "pending";

      reminder.completedAt =
        undefined;

      reminder.snoozedUntil =
        undefined;

      await reminder.save();

      return res.json({
        success: true,
        message:
          "Reminder reset to pending.",
        reminder,
      });
    } catch (error) {
      console.error(
        "Error resetting reminder:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to reset reminder.",
      });
    }
  }
);

export default router;