import { Schema, model, type Types } from "mongoose";

export type SessionType = {
  user: Types.ObjectId;
  refreshTokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

const sessionSchema = new Schema<SessionType>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    refreshTokenHash: {
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

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session = model<SessionType>("Session", sessionSchema);
