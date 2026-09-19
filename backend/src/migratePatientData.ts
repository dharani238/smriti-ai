import dotenv from "dotenv";
import mongoose from "mongoose";

import User from "./models/User";
import Patient from "./models/patient";
import GameSession from "./models/GameSession";
import FamilyMember from "./models/FamilyMember";
import Memory from "./models/Memory";
import Reminder from "./models/Reminder";
import Recommendation from "./models/Recommendation";

dotenv.config();

const OLD_PATIENT_ID = "6aad5e710b0caa4553b0eac4";
const NEW_PATIENT_ID = "6aad6e150b0caa4553b0eac7";

async function migratePatientData() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from .env");
    }

    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected.");
    console.log("");
    console.log("Old Patient ID:", OLD_PATIENT_ID);
    console.log("New Patient ID:", NEW_PATIENT_ID);
    console.log("");

    // --------------------------------------------------
    // 1. Make sure the target caregiver-created patient exists
    // --------------------------------------------------

    const targetPatient = await Patient.findById(NEW_PATIENT_ID);

    if (!targetPatient) {
      throw new Error(
        `Target patient ${NEW_PATIENT_ID} does not exist. Migration stopped.`
      );
    }

    console.log(
      `Target patient found: ${targetPatient.name}`
    );

    // --------------------------------------------------
    // 2. Find the patient user currently linked to OLD ID
    // --------------------------------------------------

    const patientUser = await User.findOne({
      role: "patient",
      patientId: OLD_PATIENT_ID,
    });

    if (!patientUser) {
      throw new Error(
        `No patient user is linked to old patient ID ${OLD_PATIENT_ID}.`
      );
    }

    console.log(
      `Patient login found: ${patientUser.email}`
    );

    // --------------------------------------------------
    // 3. Safety check:
    // Make sure another patient login is not already using NEW ID
    // --------------------------------------------------

    const existingTargetUser = await User.findOne({
      role: "patient",
      patientId: NEW_PATIENT_ID,
      _id: { $ne: patientUser._id },
    });

    if (existingTargetUser) {
      throw new Error(
        `Another patient login is already linked to ${NEW_PATIENT_ID}. Migration stopped.`
      );
    }

    // --------------------------------------------------
    // 4. Move game sessions
    // --------------------------------------------------

    const gameResult = await GameSession.updateMany(
      {
        patientId: OLD_PATIENT_ID,
      },
      {
        $set: {
          patientId: NEW_PATIENT_ID,
        },
      }
    );

    console.log(
      `Game sessions migrated: ${gameResult.modifiedCount}`
    );

    // --------------------------------------------------
    // 5. Move family members
    // --------------------------------------------------

    const familyResult = await FamilyMember.updateMany(
      {
        patientId: OLD_PATIENT_ID,
      },
      {
        $set: {
          patientId: NEW_PATIENT_ID,
        },
      }
    );

    console.log(
      `Family members migrated: ${familyResult.modifiedCount}`
    );

    // --------------------------------------------------
    // 6. Move memories
    // --------------------------------------------------

    const memoryResult = await Memory.updateMany(
      {
        patientId: OLD_PATIENT_ID,
      },
      {
        $set: {
          patientId: NEW_PATIENT_ID,
        },
      }
    );

    console.log(
      `Memories migrated: ${memoryResult.modifiedCount}`
    );

    // --------------------------------------------------
    // 7. Move reminders
    // --------------------------------------------------

    const reminderResult = await Reminder.updateMany(
      {
        patientId: OLD_PATIENT_ID,
      },
      {
        $set: {
          patientId: NEW_PATIENT_ID,
        },
      }
    );

    console.log(
      `Reminders migrated: ${reminderResult.modifiedCount}`
    );

    // --------------------------------------------------
    // 8. Move recommendations
    // --------------------------------------------------

    const recommendationResult =
      await Recommendation.updateMany(
        {
          patientId: OLD_PATIENT_ID,
        },
        {
          $set: {
            patientId: NEW_PATIENT_ID,
          },
        }
      );

    console.log(
      `Recommendations migrated: ${recommendationResult.modifiedCount}`
    );

    // --------------------------------------------------
    // 9. Link existing patient login to caregiver patient
    // --------------------------------------------------

    patientUser.patientId = NEW_PATIENT_ID;

    await patientUser.save();

    console.log(
      "Patient login linked to new Patient ID."
    );

    // --------------------------------------------------
    // 10. Verify migration
    // --------------------------------------------------

    const [
      gameSessions,
      familyMembers,
      memories,
      reminders,
      recommendations,
    ] = await Promise.all([
      GameSession.countDocuments({
        patientId: NEW_PATIENT_ID,
      }),

      FamilyMember.countDocuments({
        patientId: NEW_PATIENT_ID,
      }),

      Memory.countDocuments({
        patientId: NEW_PATIENT_ID,
      }),

      Reminder.countDocuments({
        patientId: NEW_PATIENT_ID,
      }),

      Recommendation.countDocuments({
        patientId: NEW_PATIENT_ID,
      }),
    ]);

    console.log("");
    console.log("================================");
    console.log("MIGRATION COMPLETE");
    console.log("================================");
    console.log("Final Patient ID:", NEW_PATIENT_ID);
    console.log("Game Sessions:", gameSessions);
    console.log("Family Members:", familyMembers);
    console.log("Memories:", memories);
    console.log("Reminders:", reminders);
    console.log("Recommendations:", recommendations);
    console.log("================================");
    console.log("");

    console.log(
      "IMPORTANT: The old Patient document was NOT deleted."
    );

    console.log(
      "You can verify everything first before removing old data."
    );
  } catch (error) {
    console.error("");
    console.error("Migration failed:");
    console.error(error);
  } finally {
    await mongoose.disconnect();

    console.log("");
    console.log("MongoDB disconnected.");
  }
}

migratePatientData();