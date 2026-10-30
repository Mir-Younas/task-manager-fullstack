import { Schema, model, type Types } from "mongoose";

export type EmailVerificationTokenType = {
  user: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

const emailVerificationTokenSchema = new Schema<EmailVerificationTokenType>(
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

emailVerificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const EmailVerificationToken = model<EmailVerificationTokenType>(
  "EmailVerificationToken",
  emailVerificationTokenSchema,
);
