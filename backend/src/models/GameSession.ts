import mongoose, { Document, Schema } from "mongoose";

export interface IGameSession extends Document {
  patientId: string;
  gameName: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  difficulty: string;
  playedAt: Date;
}

const gameSessionSchema = new Schema<IGameSession>(
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

    score: {
      type: Number,
      required: true,
    },

    totalQuestions: {
      type: Number,
      required: true,
    },

    accuracy: {
      type: Number,
      required: true,
    },

    difficulty: {
      type: String,
      required: true,
      trim: true,
    },

    playedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const GameSession = mongoose.model<IGameSession>(
  "GameSession",
  gameSessionSchema
);

export default GameSession;