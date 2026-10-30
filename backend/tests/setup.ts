
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { afterAll, afterEach, beforeAll } from "@jest/globals";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-jwt-secret";
process.env.REFRESH_TOKEN_SECRET_KEY = "test-refresh-secret";
process.env.EMAIL_VERIFICATION_TOKEN_SECRET =
  "test-email-verification-secret";
process.env.PASSWORD_RESET_TOKEN_SECRET = "test-password-reset-secret";
process.env.CLIENT_URL = "http://localhost:3000";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();

  const testMongoUri = mongoServer.getUri();

  await mongoose.connect(testMongoUri, {
    family: 4,
    serverSelectionTimeoutMS: 10000,
  });
});

afterEach(async () => {
  if (mongoose.connection.readyState !== 1) {
    return;
  }

  await Promise.all(
    Object.values(mongoose.connection.collections).map((collection) =>
      collection.deleteMany({}),
    ),
  );
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  if (mongoServer) {
    await mongoServer.stop();
  }
});
