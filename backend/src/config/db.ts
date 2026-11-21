import mongoose from "mongoose";

let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined");
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(mongoUri).catch((error: unknown) => {
      connectionPromise = null;
      throw error;
    });
  }

  await connectionPromise;
};
