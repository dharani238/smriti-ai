import mongoose, { Document, Schema } from "mongoose";

export interface IPatient extends Document {
  name: string;
  age: number;
  language: string;
  caregiverId?: string;
  createdAt: Date;
}

const patientSchema = new Schema<IPatient>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
    },

    language: {
      type: String,
      required: true,
      default: "English",
    },

    caregiverId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model<IPatient>("Patient", patientSchema);

export default Patient;