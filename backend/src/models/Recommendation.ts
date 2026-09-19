import mongoose, { Document, Schema } from "mongoose";

export interface IRecommendation extends Document {
  patientId: string;
  gameName: string;
  currentDifficulty: string;
  recommendedDifficulty: string;
  reason: string;
  accuracy: number;
}

const recommendationSchema = new Schema<IRecommendation>(
  {
    patientId: {
      type: String,
      required: true,
    },

    gameName: {
      type: String,
      required: true,
      trim: true,
    },

    currentDifficulty: {
      type: String,
      required: true,
      trim: true,
    },

    recommendedDifficulty: {
      type: String,
      required: true,
      trim: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    accuracy: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Recommendation = mongoose.model<IRecommendation>(
  "Recommendation",
  recommendationSchema
);

export default Recommendation;