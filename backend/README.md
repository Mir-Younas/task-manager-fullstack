# Task Management API

A RESTful backend for a task management application, built with **Node.js, Express, TypeScript, MongoDB, and Mongoose**. It supports secure account management, role-based task access, and documented HTTP endpoints.

**Live API:** [Health check](https://task-api-production-8979.up.railway.app/health) · [Interactive Swagger documentation](https://task-api-production-8979.up.railway.app/api-docs)

> **Deployment note:** The backend is hosted on Railway with MongoDB Atlas. Google OAuth has been tested locally; production OAuth configuration should be verified independently.

## Features

### Authentication and security

- Email/password signup and login with bcrypt password hashing
- Email verification, resend verification, and password recovery
- Google OAuth 2.0 Authorization Code Flow with PKCE and verified Google ID tokens
- JWT access tokens in HTTP-only cookies and database-backed refresh sessions; refresh tokens are stored as hashes
- Logout with refresh-session revocation
- Role-based access (`USER`, `ADMIN`) and blocked-account checks
- IP-based login rate limiting and progressive account-level login cooldowns
- Zod validation, centralized error handling, and controlled error responses

### Task management

- Create, list, view, update, and delete tasks
- User-specific task visibility and ownership checks
- Filter tasks by status and search titles case-insensitively
- Sort tasks by creation date (newest or oldest) and paginate results
- Administrator access across users' tasks
- Task responses expose the author's name without exposing their email or ID
- No-op task updates are rejected

### Developer experience

- Swagger UI / OpenAPI documentation for the standard HTTP API
- **Pino** for structured application logging
- Jest and Supertest integration tests backed by MongoDB Memory Server
- ESLint and TypeScript build checks
- Railway deployment and MongoDB Atlas persistence

## Technology

| Category              | Tools                                          |
| --------------------- | ---------------------------------------------- |
| Runtime               | Node.js 22, TypeScript                         |
| HTTP API              | Express, CORS, cookie-parser                   |
| Database              | MongoDB, Mongoose, MongoDB Atlas               |
| Authentication        | JSON Web Tokens, bcrypt, `google-auth-library` |
| Validation & security | Zod, `express-rate-limit`                      |
| Logging               | Pino (structured logging)                      |
| Documentation         | Swagger / OpenAPI                              |
| Testing               | Jest, Supertest, MongoDB Memory Server, SWC    |
| Quality & deployment  | ESLint, TypeScript compiler, Railway           |

## API reference

**Base URL (production):** `https://task-api-production-8979.up.railway.app`

### Health

| Method | Path      | Description      |
| ------ | --------- | ---------------- |
| `GET`  | `/health` | API health check |

### Authentication

| Method | Path                            | Description                                  |
| ------ | ------------------------------- | -------------------------------------------- |
| `POST` | `/api/auth/signup`              | Register with email and password             |
| `POST` | `/api/auth/login`               | Log in and set authentication cookies        |
| `GET`  | `/api/auth/me`                  | Return the authenticated user                |
| `POST` | `/api/auth/verify-email`        | Verify an email using a token                |
| `POST` | `/api/auth/resend-verification` | Request another verification email           |
| `POST` | `/api/auth/forgot-password`     | Request password reset                       |
| `POST` | `/api/auth/reset-password`      | Reset password with a valid token            |
| `POST` | `/api/auth/refresh`             | Refresh the authenticated session            |
| `POST` | `/api/auth/logout`              | Revoke the refresh session and clear cookies |
| `GET`  | `/api/auth/google`              | Begin Google sign-in in the browser          |
| `GET`  | `/api/auth/google/callback`     | Handle Google's OAuth redirect               |

### Tasks

All task routes require authentication.

`GET /api/tasks` supports these optional query parameters:

| Parameter | Values                                                 | Default          |
| --------- | ------------------------------------------------------ | ---------------- |
| `status`  | `pending`, `in_progress`, `completed`                  | All statuses     |
| `search`  | Task title text (case-insensitive; max 100 characters) | No search filter |
| `sort`    | `newest`, `oldest`                                     | `newest`         |
| `page`    | Positive integer                                       | `1`              |
| `limit`   | Integer from 1 to 100                                  | `10`             |

Example: `GET /api/tasks?status=pending&search=report&sort=oldest&page=1&limit=10`

The response includes a `tasks` array and `pagination` metadata (`page`, `limit`, `total`, `totalPages`). Regular users only see their own tasks; administrators can query all users' tasks.

| Method   | Path                 | Description           | Access                    |
| -------- | -------------------- | --------------------- | ------------------------- |
| `POST`   | `/api/tasks`         | Create a task         | Authenticated user        |
| `GET`    | `/api/tasks`         | List accessible tasks | Own tasks; admin sees all |
| `GET`    | `/api/tasks/:taskId` | Retrieve a task       | Owner or admin            |
| `PATCH`  | `/api/tasks/:taskId` | Update a task         | Owner or admin            |
| `DELETE` | `/api/tasks/:taskId` | Delete a task         | Owner or admin            |

**Common responses:** `400` invalid input, `401` unauthenticated, `403` forbidden, `404` not found, `409` conflict, and `429` rate-limited. Actual responses and request bodies are described in Swagger.

### Swagger / OpenAPI

- **Local:** [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
- **Production:** [https://task-api-production-8979.up.railway.app/api-docs](https://task-api-production-8979.up.railway.app/api-docs)

Swagger UI documents request schemas, validation rules, route parameters, authentication requirements, and responses for the standard API endpoints. It provides local and deployed server options. **Google OAuth routes are intentionally listed here instead of being executable in Swagger UI:** OAuth login requires top-level browser redirects, not an ordinary `fetch()` request. To test Google sign-in, open `/api/auth/google` directly in a browser.

## Getting started

### Prerequisites

- **Node.js `>=22.14.0 <23`** and npm
- MongoDB instance or MongoDB Atlas connection
- SMTP credentials for email features
- Google OAuth credentials if testing Google sign-in

The project enforces its supported Node.js version through `package.json` and `.npmrc` (`engine-strict=true`).

### Installation

```bash
npm install
```

Copy `.env.example` to `.env` and configure the required values. The following is a **partial example**; use `.env.example` and the environment validator as the authoritative list, especially for email and token settings.

```dotenv
NODE_ENV=development

PORT=5000

MONGODB_URI=mongodb://127.0.0.1:27017/task-api

JWT_SECRET=replace_with_a_long_random_secret

CLIENT_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your-google-client-id

GOOGLE_CLIENT_SECRET=your-google-client-secret

GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

Never commit `.env`, credentials, or token secrets. Production values should be configured in Railway. Register the exact OAuth callback URL in Google Cloud for each environment.

### Run locally

```bash
npm run dev
```

The default local API URL is `http://localhost:5000`; documentation is available at `/api-docs`.

## Authentication design

**Email/password:** Signup creates an unverified account and attempts to send a verification email. Verified, eligible users can log in. Password reset uses time-limited tokens; the reset flow requires the user to sign in again.

**Sessions:** Successful login sets HTTP-only access and refresh cookies. Refresh-token hashes are persisted in MongoDB. `/api/auth/refresh` renews access; logout revokes the supplied refresh session and clears authentication cookies. The refresh cookie is scoped to `/api/auth`. Cookie behavior depends on HTTPS, CORS, and deployment settings.

**Google OAuth:** The backend initiates an authorization-code flow with PKCE and state verification, validates Google's ID token, and creates or retrieves a Google-linked account. It does not automatically link an existing password account solely because the email matches. After success, the application issues its own session cookies and redirects to `CLIENT_URL`.

**Login abuse protection:** An IP-based rate limiter protects login requests. Per-account cooldowns apply after repeated failures:

| Failed attempt | Result                                     |
| -------------- | ------------------------------------------ |
| 1–4            | `401 Unauthorized` for invalid credentials |
| 5              | 30-second cooldown                         |
| 6              | 1-minute cooldown                          |
| 7              | 5-minute cooldown                          |
| 8+             | 15-minute cooldown                         |

Requests during a cooldown do not extend it; successful password login resets the failure state. Atomic failed-login updates reduce concurrency issues.

## Project layout

```text
backend/

├── src/

│   ├── config/          # Database, Swagger, environment validation

│   ├── constants/       # Shared authentication constants

│   ├── controllers/     # HTTP request and response handlers

│   ├── docs/            # OpenAPI route definitions

│   ├── enums/           # Application enums

│   ├── middleware/      # Authentication, validation, errors, rate limiting

│   ├── models/          # Mongoose models

│   ├── routes/          # Auth and task routes

│   ├── services/        # Authentication, Google OAuth, task business logic

│   ├── types/           # Shared TypeScript types

│   ├── utils/           # JWT, cookies, errors, security utilities

│   ├── validation/      # Zod schemas

│   ├── app.ts

│   └── server.ts

├── tests/

│   ├── helpers/

│   │   ├── auth.helper.ts

│   │   └── task.helper.ts

│   ├── auth.test.ts

│   ├── task.test.ts

│   └── setup.ts

├── .env.example

├── jest.config.cjs

├── eslint.config.mjs

└── tsconfig.json
```

## Tests and quality checks

The integration tests use **Jest + Supertest + MongoDB Memory Server**, so they run against a temporary database rather than the production Atlas instance. Verification-email delivery is mocked in the relevant test suites.

**Latest confirmed results:** **39 passing integration tests** across two suites. Earlier lint and build checks were reported as passing; rerun them after the latest changes.

| Suite          |  Tests | Coverage highlights                                                                    |
| -------------- | -----: | -------------------------------------------------------------------------------------- |
| Authentication |     15 | Signup, validation, duplicate/concurrent registration, login, session, refresh, logout |
| Tasks          |     24 | CRUD, ownership, admin permissions, filtering, search, sorting, pagination, validation |
| **Total**      | **39** | **All passed**                                                                         |

```bash
# Run the complete integration test suite

npx jest --runInBand --verbose

# Lint application code

npm run lint

# Lint tests

npm run lint:test

# Compile production TypeScript

npm run build
```

Google OAuth has been manually tested locally; these 39 tests do not establish automated OAuth coverage.

## Error handling and logging

The API uses centralized error middleware and standardized JSON errors:

```json
{
  "success": false,

  "message": "Error message"
}
```

Zod validation failures return `400 Bad Request`; other expected client errors retain appropriate HTTP status codes. Unexpected errors return a generic `500` response while details are recorded internally. Authentication rate limiters are skipped when `NODE_ENV=test` to avoid interfering with integration tests; they remain enabled in development and production.

**Logging:** The application uses **Pino** for structured logs. This README does not assume a particular Pino transport, pretty-printer, redaction policy, or HTTP logging adapter without checking the current source configuration.

## Deployment

The backend is deployed to **Railway**, using **MongoDB Atlas** for persistent storage. Express proxy trust is configured for Railway so IP-aware middleware can account for forwarded client addresses.

```bash
npm run build

npm start
```

Set environment variables in Railway and verify production cookies, CORS, SMTP, and Google OAuth callback configuration before enabling those flows for users.

## Project context

Developed as part of a software engineering internship assignment.

## License

ISC
