import { Schema, model, type Types } from "mongoose";

export type PasswordResetTokenType = {
  user: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

const passwordResetTokenSchema = new Schema<PasswordResetTokenType>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PasswordResetToken = model<PasswordResetTokenType>(
  "PasswordResetToken",
  passwordResetTokenSchema,
);
