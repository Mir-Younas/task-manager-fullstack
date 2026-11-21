import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes";
import { globalErrorHandler } from "./middleware/error.middleware";
import morgan from "morgan";
import taskRouter from "./routes/task.routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import cors from "cors";
import { connectDB } from "./config/db";

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

// Initialize or reuse MongoDB connection outside the test environment
if (process.env.NODE_ENV !== "test") {
  app.use(async (_req, _res, next) => {
    try {
      await connectDB();
      next();
    } catch (error) {
      next(error);
    }
  });
}

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      withCredentials: true,
      operationsSorter: "alpha",
    },
  }),
);

app.use(globalErrorHandler);

export default app;
