import swaggerJsdoc from "swagger-jsdoc";
import path from "node:path";

import { ACCESS_TOKEN_COOKIE_NAME } from "../constants/auth.constants";

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Task Management API",
      version: "1.0.0",
      description:
        "RESTful API for user authentication, task management, role-based authorization, Google OAuth, and account status control.",
    },

    servers: [
      {
        url: "http://localhost:5000",
        description: "Local Development Environment",
      },
      {
        url: "https://taskflow-api-neon-nine.vercel.app",
        description: "Production Environment",
      },
    ],

    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: ACCESS_TOKEN_COOKIE_NAME,
        },
      },
    },
  },

  apis: [
    path.join(__dirname, "../docs/**/*.ts"),
    path.join(__dirname, "../docs/**/*.js"),
  ],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
