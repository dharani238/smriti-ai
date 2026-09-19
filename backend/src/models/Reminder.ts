import mongoose, { Document, Schema } from "mongoose";

export type ReminderStatus =
  | "pending"
  | "completed"
  | "snoozed";

export interface IReminder extends Document {
  patientId: string;
  title: string;
  description?: string;
  date: string;
  time: string;

  status: ReminderStatus;

  completedAt?: Date;

  snoozedUntil?: Date;
}

const reminderSchema = new Schema<IReminder>(
  {
    patientId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: false,
      trim: true,
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "snoozed"],
      default: "pending",
      required: true,
    },

    completedAt: {
      type: Date,
      required: false,
    },

    snoozedUntil: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Reminder =
  mongoose.model<IReminder>(
    "Reminder",
    reminderSchema
  );

export default Reminder;