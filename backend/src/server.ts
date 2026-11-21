import "dotenv/config";

import app from "./app";
import { connectDB } from "./config/db";
import { validateEnv } from "./config/validate-env";

validateEnv();

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  const startServer = async (): Promise<void> => {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  };

  startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
}

export default app;
