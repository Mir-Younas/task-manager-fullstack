export const validateEnv = (): void => {
  const requiredEnvVars = [
    "JWT_SECRET",
    "REFRESH_TOKEN_SECRET_KEY",
    "EMAIL_VERIFICATION_TOKEN_SECRET",
    "PASSWORD_RESET_TOKEN_SECRET",
    "CLIENT_URL",
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASS",
  ];

  for (const key of requiredEnvVars) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
};