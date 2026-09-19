import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

import Memory from "./models/Memory";
import User from "./models/User";

dotenv.config();

// ======================================================
// PATIENT ACCOUNT
// ======================================================
//
// This is only used to identify the development
// patient account.
//
// We do NOT hardcode the MongoDB patientId anymore.
// The script reads the patient's current patientId
// directly from the User collection.
//

const PATIENT_EMAIL =
  "dheerghasidrakshayani@gmail.com";

// ======================================================
// TEST PHOTO MEMORIES
// ======================================================
//
// Temporary development data.
//
// Later these memories should be created by the
// caregiver through the caregiver dashboard.
//

const memories = [
  {
    fileName: "family.jpeg",
    title: "Family Time",
    category: "Family",
    description:
      "A familiar family moment shared together.",
  },

  {
    fileName: "childrens.jpeg",
    title: "Family Memory",
    category: "Family",
    description:
      "A meaningful photograph connected to a family memory.",
  },

  {
    fileName: "grandaughters.jpeg",
    title: "A Special Day",
    category: "Life Events",
    description:
      "A familiar photograph connected to a special memory.",
  },

  {
    fileName:
      "son and daughter in law.jpeg",
    title: "Family Gathering",
    category: "Family",
    description:
      "A familiar photograph connected to time spent with family.",
  },
];

// ======================================================
// IMAGE -> BASE64 DATA URL
// ======================================================

function imageToDataUrl(
  filePath: string
): string {
  const extension = path
    .extname(filePath)
    .toLowerCase();

  let mimeType = "image/jpeg";

  if (extension === ".png") {
    mimeType = "image/png";
  } else if (extension === ".webp") {
    mimeType = "image/webp";
  } else if (
    extension === ".jpg" ||
    extension === ".jpeg"
  ) {
    mimeType = "image/jpeg";
  }

  const imageBuffer =
    fs.readFileSync(filePath);

  const base64 =
    imageBuffer.toString("base64");

  return `data:${mimeType};base64,${base64}`;
}

// ======================================================
// SEED PHOTO MEMORIES
// ======================================================

async function seedPhotoMemories() {
  try {
    // --------------------------------------------------
    // CHECK MONGODB URI
    // --------------------------------------------------

    const mongoUri =
      process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error(
        "MONGODB_URI was not found in backend/.env"
      );
    }

    // --------------------------------------------------
    // CONNECT
    // --------------------------------------------------

    await mongoose.connect(mongoUri);

    console.log(
      "MongoDB connected successfully"
    );

    // --------------------------------------------------
    // FIND PATIENT USER
    // --------------------------------------------------

    const patientUser =
      await User.findOne({
        email:
          PATIENT_EMAIL.toLowerCase(),
        role: "patient",
      });

    if (!patientUser) {
      throw new Error(
        `Patient account was not found for ${PATIENT_EMAIL}`
      );
    }

    if (!patientUser.patientId) {
      throw new Error(
        "The patient account does not have a linked patientId."
      );
    }

    const patientId =
      patientUser.patientId.toString();

    console.log("");
    console.log(
      "Patient account:",
      patientUser.email
    );

    console.log(
      "Using patientId:",
      patientId
    );

    console.log("");

    // --------------------------------------------------
    // FIND PHOTO FOLDER
    // --------------------------------------------------

    const memoryFolder =
      path.resolve(
        __dirname,
        "../../frontend/src/assets/test-memories"
      );

    console.log(
      "Reading photos from:",
      memoryFolder
    );

    if (
      !fs.existsSync(
        memoryFolder
      )
    ) {
      throw new Error(
        `Test memory folder was not found: ${memoryFolder}`
      );
    }

    // --------------------------------------------------
    // SHOW AVAILABLE FILES
    // --------------------------------------------------

    const availableFiles =
      fs.readdirSync(
        memoryFolder
      );

    console.log(
      "Files found:",
      availableFiles
    );

    console.log("");

    // --------------------------------------------------
    // SEED EACH MEMORY
    // --------------------------------------------------

    for (
      const item of memories
    ) {
      const imagePath =
        path.join(
          memoryFolder,
          item.fileName
        );

      // -----------------------------------------------
      // CHECK IMAGE
      // -----------------------------------------------

      if (
        !fs.existsSync(
          imagePath
        )
      ) {
        console.log(
          `Skipped: ${item.fileName} was not found.`
        );

        continue;
      }

      // -----------------------------------------------
      // CONVERT IMAGE
      // -----------------------------------------------

      const photo =
        imageToDataUrl(
          imagePath
        );

      // -----------------------------------------------
      // LOOK FOR MEMORY WITH SAME TITLE
      // FOR THIS PATIENT
      // -----------------------------------------------

      const existingMemory =
        await Memory.findOne({
          patientId,
          title: item.title,
        });

      if (existingMemory) {
        existingMemory.description =
          item.description;

        existingMemory.category =
          item.category;

        existingMemory.photo =
          photo;

        await existingMemory.save();

        console.log(
          `Updated: ${item.title}`
        );

        continue;
      }

      // -----------------------------------------------
      // CREATE MEMORY
      // -----------------------------------------------

      await Memory.create({
        patientId,

        title: item.title,

        description:
          item.description,

        category:
          item.category,

        photo,
      });

      console.log(
        `Added: ${item.title}`
      );
    }

    // --------------------------------------------------
    // VERIFY
    // --------------------------------------------------

    const photoMemories =
      await Memory.find({
        patientId,

        photo: {
          $exists: true,
          $ne: "",
        },
      });

    console.log("");
    console.log(
      "======================================="
    );

    console.log(
      "PATIENT ID:"
    );

    console.log(
      patientId
    );

    console.log("");

    console.log(
      `Photo memories available: ${photoMemories.length}`
    );

    photoMemories.forEach(
      (memory, index) => {
        console.log(
          `${index + 1}. ${memory.title}`
        );
      }
    );

    console.log(
      "======================================="
    );

    if (
      photoMemories.length >= 3
    ) {
      console.log("");
      console.log(
        "Photo Recall is ready."
      );
    } else {
      console.log("");
      console.log(
        "Photo Recall needs at least 3 photo memories."
      );
    }

    console.log("");
    console.log(
      "Photo memory seeding completed."
    );
  } catch (error) {
    console.error(
      "Photo memory seed error:",
      error
    );
  } finally {
    await mongoose.disconnect();

    console.log(
      "MongoDB disconnected."
    );
  }
}

// ======================================================
// RUN
// ======================================================

seedPhotoMemories();