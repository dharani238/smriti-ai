import mongoose, {
  Document,
  Schema,
} from "mongoose";

export interface IFamilyMember
  extends Document {
  patientId: string;
  name: string;
  relationship: string;
  age?: number;
  photo?: string;
}

const familyMemberSchema =
  new Schema<IFamilyMember>(
    {
      patientId: {
        type: String,
        required: true,
        trim: true,
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      relationship: {
        type: String,
        required: true,
        trim: true,
      },

      age: {
        type: Number,
        required: false,
      },

      /*
       * For the current prototype this stores
       * the image as a Base64 data URL.
       *
       * Example:
       * data:image/jpeg;base64,...
       */
      photo: {
        type: String,
        required: false,
      },
    },
    {
      timestamps: true,
    }
  );

const FamilyMember =
  mongoose.model<IFamilyMember>(
    "FamilyMember",
    familyMemberSchema
  );

export default FamilyMember;