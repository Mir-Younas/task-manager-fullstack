# TaskFlow Frontend

A modern, responsive task management web application built with **React 19, TypeScript, Vite 8, and Tailwind CSS v4**.

TaskFlow provides a clean interface for account authentication, organizing tasks, tracking progress, and managing daily productivity.

## Live Application

**Frontend:** https://taskflow-frontend-hsz5.onrender.com

**Deployment Platform:** Render Static Site

## Features

### Authentication and Account Management

- Email and password registration and login
- Email verification through verification links
- Resend verification email
- Forgot-password and password-reset pages
- Google sign-in
- Automatic session restoration
- Protected dashboard routes
- Logout functionality
- Form validation and API error handling
- Cookie-based authentication through the API

### Task Management

- Create, view, update, and delete tasks
- Dedicated task details page
- Task statuses: Pending, In Progress, and Completed
- Search tasks by title
- Filter tasks by status
- Sort tasks by creation date
- Paginated task list
- Display task author and timestamps
- Confirmation dialog before deletion
- Loading, empty, and error states

### User Interface

- Modern, responsive dashboard
- Sidebar and header navigation
- Reusable components and dialogs
- Client-side navigation with React Router
- Axios-based API communication
- React Hook Form and Zod validation
- Lucide React icons

## Technology Stack

| Category | Technology |
| --- | --- |
| UI Library | React 19 |
| Language | TypeScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router |
| Forms | React Hook Form |
| Validation | Zod |
| HTTP Client | Axios |
| Icons | Lucide React |
| Code Quality | ESLint, TypeScript |
| Hosting | Render Static Site |

## Application Routes

| Route | Description | Access |
| --- | --- | --- |
| `/` | Home page | Public |
| `/login` | Login | Public |
| `/signup` | Registration | Public |
| `/email-verification` | Email verification | Public |
| `/forgot-password` | Forgot password | Public |
| `/password-reset` | Reset password | Public |
| `/tasks` | Task dashboard | Protected |
| `/tasks/:taskId` | Task details | Protected |
| `*` | Not-found page | Public |

Protected routes use the authentication context and `ProtectedRoute` component.

## Getting Started

### Prerequisites

- Node.js compatible with Vite 8
- npm
- A running TaskFlow API

### Installation

Clone the repository:

```bash
git clone https://github.com/Mir-Younas/task-manager-fullstack.git
cd task-manager-fullstack/frontend
```

Install dependencies:

```bash
npm install
```

### Environment Configuration

Create a `.env` file inside the `frontend` directory.

For local development:

```dotenv
VITE_API_BASE_URL=http://localhost:5000
```

For production:

```dotenv
VITE_API_BASE_URL=https://taskflow-api-tm54.onrender.com
```

Ensure the environment variable matches the one used in `src/config/axios.ts`.

Only expose public configuration through Vite environment variables. Never store private API keys or authentication secrets in the frontend.

### Run Locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Authentication

The frontend provides interfaces for email/password authentication and Google sign-in.

Users can register, verify their email addresses, sign in, request password resets, and manage their sessions.

The application uses authentication context to maintain user state and protect dashboard routes.

A shared Axios client handles API communication and authentication-related requests.

## Task Management

Authenticated users can manage tasks through the dashboard.

The task list supports searching, filtering, sorting, and pagination.

Users can open an individual task to view its details, edit its information, or delete it after confirmation.

The interface displays loading indicators, empty states, and error messages where appropriate.

## Project Structure

```text
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── tasks/
│   ├── config/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── validations/
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
└── vite.config.ts
```

## Development Commands

Start the development server:

```bash
npm run dev
```

Run ESLint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

The production build generates optimized static assets in the `dist/` directory.

## Deployment

The frontend is deployed on **Render Static Site**.

### Render Configuration

| Setting | Value |
| --- | --- |
| Service | `taskflow-frontend` |
| Type | Static Site |
| Repository | `Mir-Younas/task-manager-fullstack` |
| Branch | `main` |
| Root Directory | `frontend` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

### Production Environment Variable

```dotenv
VITE_API_BASE_URL=https://taskflow-api-tm54.onrender.com
```

### Client-Side Routing

The frontend uses React Router.

To support direct navigation and page refreshes, configure the following Render rewrite rule:

| Source | Destination | Action |
| --- | --- | --- |
| `/*` | `/index.html` | Rewrite |

This allows routes such as `/login`, `/signup`, and `/tasks/:taskId` to load correctly when accessed directly.

### Deployment Workflow

1. Implement changes on a feature branch.
2. Test the frontend locally.
3. Run lint and production build checks.
4. Push changes to GitHub.
5. Create and merge a pull request into `main`.
6. Deploy the latest changes on Render.
7. Verify the live frontend.

## Error Handling

The frontend includes:

- Client-side form validation
- API error messages
- Loading indicators
- Empty task states
- Error states for failed requests
- Protected route handling
- Confirmation dialogs for destructive actions

## Troubleshooting

### Application Takes Time to Load Data

The connected API may take additional time to respond after inactivity on free hosting.

### Login or Registration Fails

Check that the API base URL is configured correctly and the API is accessible.

### Authentication Session Is Not Restored

Check browser cookie behavior, API connectivity, and Axios credential configuration.

### Refreshing a Page Returns 404

Ensure the Render rewrite rule is configured:

```text
Source: /*
Destination: /index.html
Action: Rewrite
```

### Environment Variable Changes Are Not Applied

Vite environment variables are included at build time. Rebuild and redeploy the frontend after changing production environment variables.

## Project Context

Developed as part of a **Full-Stack Development Internship Assignment at AppRo8**.

The frontend demonstrates React development, TypeScript, REST API integration, authentication interfaces, responsive design, form validation, and production deployment.

## License

Refer to the repository's license configuration.