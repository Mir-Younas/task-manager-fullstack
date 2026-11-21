TaskFlow — Full-Stack Task Manager
A modern, responsive task management application for organizing work, tracking progress, and managing tasks securely. Built with React, TypeScript, Express, and MongoDB, TaskFlow combines a clean dashboard with a REST API and account authentication.

Live Application · API Documentation · API Health
Features
- Account management: Email/password signup and login, email verification, resend verification, password recovery, and Google sign-in.
- Secure sessions: HTTP-only authentication cookies, refresh sessions, protected routes, and role-based API authorization.
- Task management: Create, view, edit, and delete tasks; track progress with Pending, In Progress, and Completed statuses.
- Find tasks quickly: Search by title, filter by status, sort by date, and navigate paginated results.
- Responsive experience: Dashboard, task details, form validation, loading states, and helpful error messages.
- Production email: Resend for deployed transactional email, with Nodemailer/SMTP available for local development.
Tech Stack
Layer	Technologies
Frontend	React 19, TypeScript, Vite 8, Tailwind CSS v4, React Router
Frontend tooling	Axios, React Hook Form, Zod, Lucide React
Backend	Node.js 22, Express, TypeScript, Mongoose
Database	MongoDB Atlas
Authentication	JWT, HTTP-only cookies, Google OAuth 2.0
Email	Resend, Nodemailer
API & testing	Swagger/OpenAPI, Jest, Supertest
Hosting	Render (frontend static site and backend web service)


Project Structure
task-manager-fullstack/
├── frontend/          # React application, routes, UI, and API client
├── backend/           # Express API, auth, tasks, models, and tests
└── README.md          # Project overview
For implementation details, see the [Frontend README](frontend/README.md) and [Backend README](backend/README.md).
Getting Started
Prerequisites: Node.js 22, npm, and a MongoDB connection. Configure backend secrets and email/OAuth credentials as needed for the features you want to test.
1. Clone the repository:
   git clone https://github.com/Mir-Younas/task-manager-fullstack.git
   cd task-manager-fullstack
2. Configure and start the backend in one terminal:
   cd backend
   npm install
   # Create .env using backend/.env.example as a reference
   npm run dev
3. Configure and start the frontend in another terminal:
   cd frontend
   npm install
   # Set VITE_API_BASE_URL=http://localhost:5000 in frontend/.env
   npm run dev
The local frontend runs at http://localhost:3000 and the API at http://localhost:5000 with the current development configuration. Ensure the backend's CLIENT_URL matches the frontend origin. Never commit .env files or expose backend secrets through Vite environment variables.
Quality Checks
Run these commands inside the corresponding project directory:
# frontend/
npm run lint
npm run build

# backend/
npm run lint
npm run build
npm test
The backend exposes interactive API documentation at /api-docs/ and a health endpoint at /health.
Deployment
Both applications are deployed on Render:
Service	Production URL
Frontend	https://taskflow-frontend-hsz5.onrender.com
Backend	https://taskflow-api-tm54.onrender.com


The frontend is a static site configured to rewrite client-side routes to /index.html. Its production API base URL is configured through VITE_API_BASE_URL. The backend uses MongoDB Atlas and environment-based configuration for CORS, authentication, Google OAuth, and Resend.

Note: The free Render backend may sleep when idle, so the first request can take 50 seconds or more. The API root (/) has no page; use /health to check its status.
Project Context
Developed as a full-stack software engineering internship project at AppRo8.
License
See the backend's license information and the repository's license configuration.