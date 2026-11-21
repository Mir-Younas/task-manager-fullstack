TaskFlow Backend — Task Management API
A RESTful task management API built with Node.js, Express, TypeScript, MongoDB, and Mongoose. It provides account authentication, email verification, password recovery, Google sign-in, and role-aware task management.

Production API: https://taskflow-api-tm54.onrender.com
Health check: https://taskflow-api-tm54.onrender.com/health
Swagger UI: https://taskflow-api-tm54.onrender.com/api-docs/

The backend is deployed on Render and uses MongoDB Atlas. Render's free web service can spin down during inactivity, causing the first request to take 50 seconds or more.
Features
Authentication and security

- Email/password signup and login with bcrypt password hashing
- Email verification, resend-verification, and password-reset flows
- Transactional email via Resend in production; Nodemailer/SMTP for local development
- Google OAuth 2.0 authorization-code flow with PKCE, state verification, and Google ID-token validation
- JWT access tokens in HTTP-only cookies, plus database-backed refresh sessions with hashed refresh tokens
- Logout with refresh-session revocation
- USER and ADMIN roles, blocked-account checks, and ownership-based authorization
- IP-based login rate limiting and progressive per-account login cooldowns
- Zod request validation and centralized error handling
  Task management
- Create, list, retrieve, update, and delete tasks
- User-specific task visibility and ownership checks; administrator access across users' tasks
- Filter by status and search task titles case-insensitively
- Sort by creation date and paginate results
- Return task author names without exposing their email addresses
- Reject no-op task updates
  Developer experience
- Swagger UI / OpenAPI documentation
- Structured application logging with Pino
- Jest and Supertest integration tests using MongoDB Memory Server
- ESLint and TypeScript build checks
- Production deployment on Render
  Technology stack
  Category Technology
  Runtime Node.js 22, TypeScript
  HTTP API Express, CORS, cookie-parser
  Database MongoDB, Mongoose, MongoDB Atlas
  Authentication JWT, bcrypt, google-auth-library
  Validation and security Zod, express-rate-limit
  Email Resend API (production), Nodemailer/SMTP (local)
  Logging Pino
  Documentation Swagger / OpenAPI
  Testing Jest, Supertest, MongoDB Memory Server, SWC
  Deployment Render Web Service

API reference
Base URL: https://taskflow-api-tm54.onrender.com
Health
Method Endpoint Description
GET /health Health check

Authentication
Method Endpoint Description
POST /api/auth/signup Create an account
POST /api/auth/login Sign in and set authentication cookies
GET /api/auth/me Get the current authenticated user
POST /api/auth/verify-email Verify an email using a token
POST /api/auth/resend-verification Request another verification email
POST /api/auth/forgot-password Request a password-reset link
POST /api/auth/reset-password Reset password with a valid token
POST /api/auth/refresh Refresh the session
POST /api/auth/logout Revoke the session and clear cookies
GET /api/auth/google Start Google OAuth in the browser
GET /api/auth/google/callback Handle the Google OAuth callback

Google OAuth requires browser redirects and should be initiated by visiting /api/auth/google directly rather than executing it as a regular Swagger request.
Tasks
All task endpoints require authentication.
Method Endpoint Description Access
POST /api/tasks Create a task Authenticated user
GET /api/tasks List tasks Own tasks; admins can see all
GET /api/tasks/:taskId Retrieve a task Owner or admin
PATCH /api/tasks/:taskId Update a task Owner or admin
DELETE /api/tasks/:taskId Delete a task Owner or admin

GET /api/tasks supports:
Parameter Values Default
status pending, in_progress, completed All statuses
search Task title, case-insensitive, up to 100 characters No filter
sort newest, oldest newest
page Positive integer 1
limit Integer from 1 to 100 10

Example:
GET /api/tasks?status=pending&search=report&sort=oldest&page=1&limit=10
List responses include a tasks array and pagination metadata (page, limit, total, totalPages). See Swagger UI for request bodies, response schemas, and validation details.

Common error statuses include 400, 401, 403, 404, 409, and 429.
Getting started
Prerequisites

- Node.js >=22.14.0 <23 and npm
- Local MongoDB or a MongoDB Atlas connection
- SMTP credentials for local email delivery
- Google OAuth credentials if testing Google sign-in
  The backend enforces its supported Node.js version using package.json and .npmrc.
  Installation
  From the repository root:
  cd backend
  npm install
  Copy .env.example to .env and populate the required values. The following is a partial example, not the complete environment contract:
  NODE_ENV=development
  PORT=5000
  MONGODB_URI=mongodb://127.0.0.1:27017/task-api
  JWT_SECRET=replace_with_a_long_random_secret
  CLIENT_URL=http://localhost:3000
  GOOGLE_CLIENT_ID=your-google-client-id
  GOOGLE_CLIENT_SECRET=your-google-client-secret
  GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Local email via Nodemailer

SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
SMTP_FROM=your-sender-address
Use .env.example and the environment validator for all other required secrets, email settings, and token configuration. Never commit .env or credentials.
Run locally
npm run dev
Local API: http://localhost:5000
Local Swagger UI: http://localhost:5000/api-docs/
Authentication design
Email/password: Signup creates an unverified account and attempts to send a verification link. Users must verify their email before password login. Password-reset links are time-limited.

Sessions: Successful login sets HTTP-only access and refresh cookies. Refresh-token hashes are stored in MongoDB. The refresh cookie is scoped to /api/auth; logout revokes the refresh session and clears cookies. Cross-origin session behavior depends on HTTPS, cookie attributes, and CORS configuration.

Google OAuth: The API uses authorization code + PKCE and state validation, verifies Google's ID token, then creates or retrieves a Google-linked user. It does not automatically link an existing password account based solely on a matching email. After sign-in, it issues application cookies and redirects to the configured frontend.

Login cooldowns:
Failed login attempt Cooldown
1–4 No account cooldown
5 30 seconds
6 1 minute
7 5 minutes
8+ 15 minutes

Requests during cooldown do not extend it. A successful password login resets the failure state.
Email delivery
The application retains its existing verification-email and password-reset workflows and HTML templates. Only the email delivery transport differs by environment:

- Local development: Nodemailer using configured SMTP credentials.
- Production on Render: Resend's HTTPS API, avoiding SMTP connection timeouts experienced on the free Render service.
  Configure the Resend API key and an authorized sender address in Render's environment settings, using the exact variable names expected by the current email service. A verified sending domain may be required to send to arbitrary recipients. Do not expose the API key in frontend variables or commit it to Git.

If account creation succeeds but email delivery fails, the account can remain unverified. Check Render application logs and the Resend sending logs, then use the resend-verification endpoint once the delivery configuration is corrected.
Project structure
backend/
├── scripts/ # Build-time helpers, including Swagger generation
├── src/
│ ├── config/ # Environment, database, Swagger configuration
│ ├── constants/ # Shared constants
│ ├── controllers/ # Request handlers
│ ├── docs/ # OpenAPI definitions
│ ├── enums/ # Application enums
│ ├── middleware/ # Authentication, validation, rate limiting, errors
│ ├── models/ # Mongoose models
│ ├── routes/ # Authentication and task routes
│ ├── services/ # Authentication, tasks, email delivery
│ ├── templates/ # Email templates
│ ├── types/ # Shared types
│ ├── utils/ # Tokens, cookies, logging, error helpers
│ ├── validation/ # Zod schemas
│ ├── app.ts
│ └── server.ts
├── tests/ # Integration tests and helpers
├── .env.example
├── jest.config.cjs
├── eslint.config.mjs
├── package.json
└── tsconfig.json
The tree summarizes major folders and files rather than every source file.
Tests and quality checks
The integration tests use Jest, Supertest, and MongoDB Memory Server, with email delivery mocked in relevant suites.

The previous documented test run reported 39 passing tests (15 authentication and 24 task tests). This is a historical result, not a claim that tests were rerun after the Resend integration.

Run from backend/:
npx jest --runInBand --verbose
npm run lint
npm run lint:test
npm run build
The production build compiles TypeScript and generates Swagger JSON using scripts/generate-swagger.cjs.
Error handling and logging
The API uses centralized error middleware and structured Pino logs. A typical error response is:
{
"success": false,
"message": "Error message"
}
Validation errors return 400; unexpected errors return a controlled 500 response while technical details are logged server-side.
Production deployment — Render
Setting Value
Service taskflow-api
Service type Web Service
Repository Mir-Younas/task-manager-fullstack
Branch main
Root directory backend
Runtime Node.js 22
Build command npm ci --include=dev && npm run build
Start command npm start
Plan Free

The application uses MongoDB Atlas for persistent storage. Configure the backend's database connection, JWT and token secrets, frontend origin, Google OAuth credentials, and email-provider credentials in Render → Environment.

Important production settings include:
NODE_ENV=production
CLIENT_URL=https://taskflow-frontend-hsz5.onrender.com
GOOGLE_CALLBACK_URL=https://taskflow-api-tm54.onrender.com/api/auth/google/callback
The Google callback URL must exactly match an authorized redirect URI for the corresponding OAuth client in Google Cloud. Configure CLIENT_URL to the deployed frontend origin, without a trailing slash.

After deploying, verify /health, /api-docs/, authentication, email delivery, Google sign-in, session refresh, and task CRUD. Render's free instance can take time to wake after inactivity.

The API intentionally has no GET / route, so visiting the bare service URL may show Cannot GET /. This is expected; use /health to check the service.
Project context
Developed as part of a full-stack software engineering internship assignment at AppRo8.
License
ISC
