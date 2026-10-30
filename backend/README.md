# Task Management API

A RESTful Task Management API built with **Node.js**, **Express**, **TypeScript**, **MongoDB**, and **Mongoose**.

The API provides email/password authentication, Google OAuth 2.0, email verification, password recovery, JWT cookie-based sessions, login abuse protection, role-based authorization, task CRUD operations, request validation, centralized error handling, Swagger/OpenAPI documentation, integration testing, and cloud deployment.

## Live Deployment

### Health Check

https://task-api-production-8979.up.railway.app/health

### Swagger API Documentation

https://task-api-production-8979.up.railway.app/api-docs

The API is deployed on **Railway** and uses **MongoDB Atlas** as the production database. Google OAuth has been verified locally; production OAuth deployment and configuration must be verified separately.

## Features

### Authentication and account security

- Email/password registration with bcrypt password hashing and Zod validation
- Email verification and verification-email resend flow
- Password recovery through time-limited reset tokens
- Google OAuth 2.0 sign-up/sign-in using Authorization Code Flow with PKCE
- Google ID token verification and verified Google email checks
- Existing Google users sign in to the same account; Google-only accounts do not require local passwords
- No automatic linking of a Google identity to an existing password-based account with the same email
- JWT access tokens and server-managed refresh sessions using HTTP-only cookies
- Refresh-token hashes stored in MongoDB; logout revokes the supplied refresh session
- Authenticated profile endpoint (`/api/auth/me`)
- User roles (`user`, `admin`) and account statuses (`active`, `blocked`)
- IP-based authentication rate limiting and account-level progressive login cooldowns
- Atomic failed-login updates to prevent concurrency issues; successful password login resets the cooldown state
- Blocked-user checks for authentication and protected routes

### Task management

- Complete Task CRUD operations
- Role-based task authorization and author-based task ownership
- Task author responses expose only the author's name
- Task updates reject requests when no values have changed

### Platform and development

- Zod request validation and centralized error handling with custom application errors
- MongoDB/Mongoose persistence and MongoDB Atlas production database
- Morgan HTTP request logging
- Swagger/OpenAPI documentation for standard API endpoints
- CORS configuration and Express proxy trust for Railway
- Jest, Supertest, and MongoDB Memory Server integration testing
- Concurrent signup race-condition testing
- Separate linting for application and test code
- Node.js engine enforcement, Railway deployment

## Tech Stack

- Node.js

- Express

- TypeScript

- MongoDB

- MongoDB Atlas

- Mongoose

- JSON Web Token (JWT)
- Google OAuth 2.0 (`google-auth-library`)

- bcrypt

- Zod

- Cookie Parser

- CORS

- Morgan

- express-rate-limit

- Swagger / OpenAPI

- Jest

- Supertest

- MongoDB Memory Server

- SWC

- ESLint

- Railway

## API Endpoints

### Health

| Method | Endpoint  | Description      |
| ------ | --------- | ---------------- |
| GET    | `/health` | Check API status |

### Authentication

| Method | Endpoint                        | Description                                                   |
| ------ | ------------------------------- | ------------------------------------------------------------- |
| POST   | `/api/auth/signup`              | Register an email/password account                            |
| POST   | `/api/auth/login`               | Log in using email and password                               |
| GET    | `/api/auth/me`                  | Get the authenticated user (access-token cookie required)     |
| POST   | `/api/auth/verify-email`        | Verify an email using a verification token                    |
| POST   | `/api/auth/resend-verification` | Request another verification email                            |
| POST   | `/api/auth/forgot-password`     | Request a password-reset email                                |
| POST   | `/api/auth/reset-password`      | Reset password using a valid reset token                      |
| POST   | `/api/auth/refresh`             | Issue a new access token using the refresh-token cookie       |
| POST   | `/api/auth/logout`              | Revoke the supplied refresh session and clear auth cookies    |
| GET    | `/api/auth/google`              | Start Google OAuth via browser navigation                     |
| GET    | `/api/auth/google/callback`     | Handle Google's redirect; not called directly by the frontend |

Google OAuth endpoints are intentionally documented in this README instead of Swagger UI because they require top-level browser redirects rather than Swagger's `fetch()` execution.

### Tasks

| Method | Endpoint             | Description        |
| ------ | -------------------- | ------------------ |
| POST   | `/api/tasks`         | Create a task      |
| GET    | `/api/tasks`         | Fetch all tasks    |
| GET    | `/api/tasks/:taskId` | Fetch a task by ID |
| PATCH  | `/api/tasks/:taskId` | Update a task      |
| DELETE | `/api/tasks/:taskId` | Delete a task      |

## Authorization

All task endpoints require authentication.

- Users can create and view tasks.

- Users can update and delete their own tasks.

- Admins can update and delete any task.

- Blocked users cannot access protected endpoints.

## Authentication Architecture

The authentication module separates HTTP concerns from application logic:

- **Routes** register endpoints, rate limiters, authentication middleware, and Zod validation.
- **Controllers** handle request/response orchestration, set or clear cookies, and redirect the browser.
- **Services** implement user authentication, Google identity verification, account checks, and session creation.
- **Models** persist users and refresh sessions in MongoDB.
- **Utilities** handle JWTs, cookie options, token-related helpers, and standardized errors.

### Email/password registration and verification

1. `POST /api/auth/signup` validates user input and creates an account with a bcrypt-hashed password.
2. The backend attempts to send an email-verification link. The response indicates whether email delivery succeeded.
3. `POST /api/auth/verify-email` validates the verification token and marks the account verified.
4. `POST /api/auth/resend-verification` supports another verification request without disclosing whether an email is registered.
5. Password login requires an eligible, verified account.

### Password login and application sessions

1. `POST /api/auth/login` validates credentials and applies login-abuse protections.
2. On success, the backend creates a JWT access token and a random refresh token.
3. The refresh token is hashed before its corresponding session is stored in MongoDB.
4. The controller sends the access and refresh tokens as HTTP-only cookies.
5. `GET /api/auth/me` reads the access-token cookie through authentication middleware.
6. `POST /api/auth/refresh` uses the refresh-token cookie to issue a fresh access-token cookie.
7. `POST /api/auth/logout` revokes the supplied refresh session and clears the authentication cookies.

The access-token cookie is available to the application's protected API routes. The refresh-token cookie is scoped to `/api/auth`. Cookie security settings depend on the environment; production HTTPS and correct frontend/backend cookie configuration are required.

### Password recovery

`POST /api/auth/forgot-password` requests a password-reset email without revealing whether an eligible account exists. `POST /api/auth/reset-password` validates the supplied reset token, updates the password, and clears authentication cookies in the response. The user signs in again with the new password.

### Google OAuth 2.0

Google authentication uses **OAuth 2.0 Authorization Code Flow with PKCE** through `google-auth-library`; Passport is not required.

1. The frontend navigates the browser to `GET /api/auth/google`.
2. The backend generates a cryptographically random OAuth `state` and PKCE `codeVerifier`, derives a SHA-256 code challenge, and creates Google's authorization URL.
3. The backend stores the state and verifier in temporary HTTP-only cookies and redirects the browser to Google.
4. Google authenticates the user and redirects to `GET /api/auth/google/callback` with an authorization `code` and returned `state`.
5. The browser automatically includes the temporary OAuth cookies. The backend compares the returned state with the saved state and exchanges the code using the PKCE verifier.
6. The backend verifies Google's ID token, including its audience and verified email, then finds or creates the Google user.
7. A returning Google user reuses the existing account. A new Google-only user is created with a `googleId` and verified email, **without a local password**.
8. An existing account with the same email but without the matching Google identity is not linked automatically; the service returns a conflict instead.
9. Blocked accounts are rejected. Successful authentication creates the application's own access and refresh tokens and stores the refresh session.
10. The callback clears temporary OAuth cookies, sets the application's HTTP-only authentication cookies, and redirects to `CLIENT_URL`.

Google tokens are used to verify identity; **your API's JWT and refresh session** are used for subsequent application requests.

**Local browser test:** Start the API and open `http://localhost:5000/api/auth/google` directly in the browser. After authentication, visit Swagger UI in the same browser and execute `GET /api/auth/me` to verify the application session. Google redirects may end at a non-running frontend during backend-only development; check the session separately.

**Google Cloud configuration:** Register the exact authorized redirect URI, such as `http://localhost:5000/api/auth/google/callback`, and set `GOOGLE_CALLBACK_URL` to the same URI. Production requires its own registered HTTPS callback and deployed environment variables.

### Login security

The authentication system includes independent **IP-level** and **account-level** defenses against repeated password attempts.

The `/api/auth/login` route uses `express-rate-limit` before credential verification. When the configured IP limit is exceeded, the API returns `429 Too Many Requests`.

Failed password attempts are tracked per account with progressive cooldowns:

| Failed attempt | Result             |
| -------------- | ------------------ |
| 1–4            | `401 Unauthorized` |
| 5              | 30-second cooldown |
| 6              | 1-minute cooldown  |
| 7              | 5-minute cooldown  |
| 8+             | 15-minute cooldown |

Requests during an active cooldown do not increment the failure counter or extend the existing cooldown. A successful password login resets `failedLoginAttempts` and `loginLockedUntil`. Updates to the failed-login state are atomic to avoid concurrency races.

The IP limiter protects the endpoint from request flooding; the account-level cooldown limits repeated guesses against a particular account. Either restriction can produce `429 Too Many Requests`.

## API Documentation

### Local Swagger UI

http://localhost:5000/api-docs

### Production Swagger UI

https://task-api-production-8979.up.railway.app/api-docs

The Swagger configuration provides both local and production server options. The Swagger configuration lists local and production servers. Cross-origin requests depend on the configured `CLIENT_URL` and browser CORS/cookie rules.

The documentation includes authentication requirements, request schemas, validation rules, path parameters, and response status codes. Google OAuth endpoints are documented in this README rather than Swagger UI because they require browser navigation.

## Project Structure

The structure below highlights the application modules and authentication-related files; additional helpers and tests may exist.

```text
src/
├── config/
│   ├── db.ts
│   ├── swagger.ts
│   └── validate-env.ts
├── constants/
│   └── auth.constants.ts
├── controllers/
│   ├── auth.controller.ts
│   └── task.controller.ts
├── docs/
│   ├── swagger/
│   │   └── auth/
│   │       ├── registration.docs.ts
│   │       ├── login.docs.ts
│   │       ├── email-verification.docs.ts
│   │       ├── password-recovery.docs.ts
│   │       └── session.docs.ts
│   └── task.swagger.ts
├── enums/
├── middleware/
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   ├── rate-limit.middleware.ts
│   └── validate.middleware.ts
├── models/
│   ├── user.model.ts
│   ├── session.model.ts
│   └── task.model.ts
├── routes/
│   ├── auth.routes.ts
│   └── task.routes.ts
├── services/
│   ├── auth.service.ts
│   ├── google-auth.service.ts
│   └── task.service.ts
├── types/
├── utils/
│   ├── app-error.ts
│   ├── async-handler.ts
│   ├── auth-cookie.ts
│   ├── jwt.ts
│   └── login-security.ts
├── validation/
│   ├── auth.schema.ts
│   └── task.schema.ts
├── app.ts
└── server.ts

tests/
├── setup.ts
├── auth.test.ts
└── task.test.ts

.env.example
eslint.config.mjs
jest.config.cjs
tsconfig.json
```

The Google OAuth endpoints are implemented in the routes, controller, and service but are intentionally omitted from the Swagger documentation files.

## Environment Variables

Copy `.env.example` to `.env` and supply the values required by your environment. The following shows the primary settings; consult the project's environment validation and `.env.example` for any additional email, JWT, or application settings.

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task-api
JWT_SECRET=replace_with_a_secure_random_secret
CLIENT_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

| Variable               | Purpose                                                                                   |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| `NODE_ENV`             | Runtime environment                                                                       |
| `PORT`                 | Express server port                                                                       |
| `MONGODB_URI`          | MongoDB connection string                                                                 |
| `JWT_SECRET`           | JWT signing secret (confirm any additional JWT secrets in your environment configuration) |
| `CLIENT_URL`           | Allowed frontend origin for CORS and Google OAuth post-login redirect                     |
| `GOOGLE_CLIENT_ID`     | Google OAuth client identifier                                                            |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret                                                                |
| `GOOGLE_CALLBACK_URL`  | Backend OAuth callback URL registered in Google Cloud Console                             |

**Security:** Never commit `.env`, MongoDB credentials, JWT secrets, or Google client secrets. Keep only placeholders in `.env.example`. Configure production environment variables in Railway and register the production callback URI with Google before testing deployed OAuth.

## Installation

Install the project dependencies:

```bash

npm install

```

## Development

Start the development server:

```bash

npm run dev

```

The API runs locally at:

http://localhost:5000

## Testing

The project includes integration tests for the authentication and task APIs using **Jest**, **Supertest**, and **MongoDB Memory Server**.

Tests run against an isolated temporary MongoDB instance and do not use the production MongoDB Atlas database.

Run all tests:

```bash

npm test

```

The previously documented test suite contained **23 integration tests** across two test suites. Run the tests again to confirm the current total:

- Authentication API tests

- Task API tests

### Authentication Tests

The authentication test suite covers:

- Successful user signup

- Invalid email validation

- Weak password validation

- Duplicate email handling

- Concurrent signup requests using the same email

- Successful login

- Incorrect password handling

- Nonexistent user handling

- Invalid login request validation

- Logout

The concurrent signup test verifies that simultaneous signup requests using the same email result in only one account being created while the remaining requests return `409 Conflict` instead of server errors.

### Task Tests

The task test suite covers:

- Unauthenticated request rejection

- Task creation

- Task validation

- Fetching all tasks

- Fetching a task by ID

- Invalid task ID handling

- Missing task handling

- Updating a task by its author

- Empty update validation

- Rejecting updates when no task values have changed

- Preventing another user from updating a task

- Deleting a task by its author

- Preventing another user from deleting a task

Task responses populate the author with the author's name only. The author's email address and user ID are not exposed in task responses.

## Code Quality

Lint the application source code:

```bash

npm run lint

```

Lint the test code separately:

```bash

npm run lint:test

```

Build the production TypeScript source:

```bash

npm run build

```

Run the integration test suite:

```bash

npm test

```

A successful project check should complete all of the following without errors:

```bash

npm run lint

npm run lint:test

npm run build

npm test

```

The previous README recorded **23 passing integration tests**. Re-run the full suite before pushing; Google OAuth was verified manually in the browser and is not claimed as an automated test.

## Production

The application is deployed on **Railway** and uses **MongoDB Atlas** as the production database.

Express is configured to trust Railway's proxy so IP-based rate limiting can correctly identify forwarded client IP addresses in production.

Railway builds and starts the application using the scripts defined in `package.json`:

```bash

npm run build

npm start

```

Use the production Swagger UI to explore and test the deployed API:

https://task-api-production-8979.up.railway.app/api-docs

## Node.js Version & Engine Enforcement

The project requires:

```text

Node.js >= 22.14.0 < 23

```

The supported Node.js version is defined in `package.json` using the `engines` field.

Engine strict mode is enabled in `.npmrc`:

```text

engine-strict=true

```

Installing dependencies with an unsupported Node.js version will fail with an `EBADENGINE` error.

## Error Handling

Application errors follow a consistent JSON response format:

```json
{
  "success": false,

  "message": "Error message"
}
```

Expected application and client errors return appropriate HTTP status codes.

Unexpected server errors return a generic `500 Internal Server Error` response while the original error is logged internally.

Malformed JSON requests are handled by the centralized error middleware and return a `400 Bad Request` response.

Authentication protection can also return `429 Too Many Requests` when either the login rate limit or account-level login cooldown is active.

Task update requests that contain valid fields but do not change any existing task values return a `400 Bad Request` response with a `No changes detected` message.

## Request Logging

Morgan is used to log HTTP requests during normal application execution.

Example:

```text

POST /api/auth/login 200 24.312 ms - 128

```

Request logging is disabled during automated tests to keep the Jest output clean.

## Project Context

This project was developed as part of a software engineering internship assignment.

## License

ISC
