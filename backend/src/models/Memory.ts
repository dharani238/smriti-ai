import mongoose, { Document, Schema } from "mongoose";

export interface IMemory extends Document {
  patientId: string;
  title: string;
  description: string;
  category: string;
  photo?: string;
}

const memorySchema = new Schema<IMemory>(
  {
    patientId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    // Personal memory photograph.
    // For the current prototype this is stored
    // as a Base64 data URL.
    photo: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Memory = mongoose.model<IMemory>(
  "Memory",
  memorySchema
);

export default Memory;