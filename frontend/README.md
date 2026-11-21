# TaskFlow Frontend

A responsive task management web application built with **React, TypeScript, Vite, and Tailwind CSS**. It connects to the Task Management API to provide account authentication, protected navigation, and task management through a clean dashboard interface.

> **Deployment status:** The frontend is currently documented for local development. Add the production frontend URL and confirm cross-origin authentication behavior after deployment.

## Features

### Authentication and account management

- Email/password signup and login
- Email verification using a verification link
- Forgot-password and reset-password flows
- Authenticated session restoration through the backend's `/api/auth/me` endpoint
- Protected dashboard routes and logout
- HTTP-only cookie-based authentication managed by the backend
- Form validation and user-friendly API error messages

### Task management

- Create, list, view, edit, and delete tasks
- Dedicated task details page at `/tasks/:taskId`
- Task statuses: Pending, In Progress, and Completed
- Search tasks by title and filter by status
- Sort by creation date (newest or oldest)
- Paginated task list
- Confirmation dialog before deleting a task
- Loading, empty, and error states for task requests
- Display task author and creation/update dates

### Interface and developer experience

- Responsive dashboard layout with sidebar and header
- Task cards, forms, and dialogs built as reusable components
- Client-side routing with React Router
- Typed API service layer using Axios
- React Hook Form and Zod for form validation
- ESLint and TypeScript build checks

## Technology

| Category | Tools |
| --- | --- |
| UI | React 19, TypeScript |
| Build tooling | Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router |
| Forms and validation | React Hook Form, Zod |
| HTTP client | Axios |
| Icons | Lucide React |
| Code quality | ESLint, TypeScript |

## Application routes

| Path | Description | Access |
| --- | --- | --- |
| `/` | Public home page | Public |
| `/login` | Sign in | Public |
| `/signup` | Create an account | Public |
| `/email-verification` | Verify an email address using a link token | Public |
| `/forgot-password` | Request a password reset | Public |
| `/password-reset` | Set a new password using a reset token | Public |
| `/tasks` | Task dashboard with search, filters, and pagination | Authenticated |
| `/tasks/:taskId` | Individual task details, editing, and deletion | Authenticated |
| `*` | Not-found page | Public |

Protected routes use the application's authentication context and `ProtectedRoute`. The backend independently enforces task ownership and administrator permissions; client-side route protection is not a substitute for API authorization.

## Getting started

### Prerequisites

- Node.js and npm compatible with the frontend's `package.json` and Vite version
- A running Task Management API
- Backend environment configured for the frontend origin, including CORS and authentication cookies

### Installation

From the repository root:

```bash
cd frontend
npm install
```

### Environment configuration

Configure the API base URL using the environment variable expected by `frontend/src/config/axios.ts`. For a typical Vite setup, this is a `VITE_`-prefixed variable, for example:

```dotenv
VITE_API_URL=http://localhost:5000
```

**Check `frontend/src/config/axios.ts` for the exact variable name before using this example.** If the Axios client already uses a fixed development URL or a Vite proxy, follow that configuration instead.

The backend's local development configuration should allow the frontend origin, typically `http://localhost:3000`.

Never put JWT secrets, refresh tokens, SMTP credentials, or other server-only secrets in frontend environment variables. Vite exposes `VITE_` variables to browser code.

### Run locally

```bash
npm run dev
```

Open the local URL printed by Vite. In the current development setup, the frontend is accessed at:

```text
http://localhost:3000
```

The backend's default local URL is:

```text
http://localhost:5000
```

Interactive backend API documentation is available at `http://localhost:5000/api-docs` when the API is running locally.

## Authentication and API integration

The frontend communicates with the Express API through a shared Axios client and dedicated service modules.

**Authentication flow:** Users register and verify their email, then sign in. The backend issues HTTP-only cookies for the session. The frontend uses authentication context to track the current user and restore an existing session. Axios handles API communication and session-refresh behavior.

**Task flow:** The dashboard requests the authenticated user's accessible tasks with optional search, status, sort, and pagination parameters. Selecting a task opens `/tasks/:taskId`, which requests that task from the API. Creating, updating, and deleting tasks uses the backend's protected task endpoints.

| Method | Endpoint | Frontend use |
| --- | --- | --- |
| `GET` | `/api/auth/me` | Restore the current user session |
| `POST` | `/api/auth/signup` | Register |
| `POST` | `/api/auth/login` | Sign in |
| `POST` | `/api/auth/logout` | Sign out |
| `POST` | `/api/auth/refresh` | Refresh the session |
| `POST` | `/api/auth/verify-email` | Verify email |
| `POST` | `/api/auth/forgot-password` | Request password reset |
| `POST` | `/api/auth/reset-password` | Reset password |
| `GET` | `/api/tasks` | List, search, filter, sort, and paginate tasks |
| `GET` | `/api/tasks/:taskId` | View a task |
| `POST` | `/api/tasks` | Create a task |
| `PATCH` | `/api/tasks/:taskId` | Update a task |
| `DELETE` | `/api/tasks/:taskId` | Delete a task |

The backend also provides email-verification resend and Google OAuth endpoints. This README does not claim a dedicated frontend Google sign-in control or resend-verification screen without confirming those UI implementations.

**Task status values:** The frontend task types currently use `pending`, `in-progress`, and `completed`. Confirm that the deployed API accepts the same values; the backend README currently documents `in_progress` for the middle status.

## Project layout

```text
frontend/
├── public/                  # Public static assets
├── src/
│   ├── components/
│   │   ├── auth/             # Authentication forms and verification UI
│   │   ├── dashboard/        # Dashboard navigation and header components
│   │   └── tasks/            # Task cards, filters, modals, pagination, dialogs
│   ├── config/               # Shared Axios configuration
│   ├── hooks/                # Task fetching hook
│   ├── layouts/              # Public and dashboard layouts
│   ├── pages/                # Route pages, including task details
│   ├── routes/               # Protected-route handling
│   ├── services/             # API service modules
│   ├── types/                # TypeScript data contracts
│   ├── utils/                # Shared helpers and API error handling
│   ├── validations/          # Zod form schemas
│   ├── App.tsx               # Application routes
│   └── main.tsx              # React entry point
├── index.html
├── package.json
└── vite.config.ts
```

This layout highlights the main application folders; it is not an exhaustive file inventory.

## Quality checks

Run from the `frontend` directory:

```bash
# Check lint rules
npm run lint

# Type-check and build production assets
npm run build
```

A successful production build creates optimized frontend assets in `dist/`. These commands should be rerun after the latest task-details changes before merging or deploying. This README does not claim an automated frontend test suite or passing results that have not been independently verified.

## Error handling and access control

- Form validation runs before submitting requests.
- API failures are displayed in the relevant page, form, or dialog.
- Task lists and task details have loading and failure states.
- Delete actions require confirmation.
- The API remains responsible for deciding whether a user can read, edit, or delete a task.

## Deployment

The frontend has not yet been assigned a confirmed production URL in this README. When deploying:

1. Build the frontend using `npm run build`.
2. Configure the production API base URL according to the Axios client.
3. Configure the backend's allowed frontend origin and cookie settings.
4. Configure the frontend host to serve `index.html` for client-side routes such as `/tasks/:taskId`.
5. Verify login, session refresh, logout, email verification, password reset, and task CRUD against the deployed API.
6. Add the confirmed frontend URL here after deployment.

**Backend:** [Railway API health check](https://task-api-production-8979.up.railway.app/health) · [Swagger API documentation](https://task-api-production-8979.up.railway.app/api-docs)

## Project context

Developed as part of a software engineering internship assignment. The frontend is the user-facing application for the Task Management API.

## License

Refer to the repository's license configuration. The backend README currently lists ISC; confirm the frontend or repository-level license before publishing a unified license statement.
