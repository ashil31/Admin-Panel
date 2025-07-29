# ArchanaEngineeringAdmin

A full-stack admin panel built with a Node/Express backend and a React (with Tailwind CSS) frontend. This project provides a comprehensive admin dashboard solution with authentication (including Google OAuth), user management, reward management, data visualization, and responsive UI components.

---

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Endpoints](#api-endpoints)
- [Frontend Flow & Routing](#frontend-flow--routing)
- [Running the Application](#running-the-application)
- [Additional Notes](#additional-notes)

---

## Overview

The **ArchanaEngineeringAdmin** project is a comprehensive admin panel designed to manage users, rewards, and other administrative tasks while delivering a modern, responsive UI. The backend is built on Express and MongoDB, coupled with Passport for authentication. The frontend is developed in React with TypeScript, styled using Tailwind CSS, and serves as the core UI for dashboard, tables, charts, and other UI elements.

---

## Project Structure

### Backend

- **Entry Points:**  
  - `backend/index.js` – Starts the HTTP server, initializes Socket.IO, and connects to the database.  
  - `backend/app.js` – Sets up Express apps, middlewares (including CORS and Passport), and routes.

- **Configuration & Utilities:**  
  - `backend/config/` – Contains database (`db.js`) and Passport configuration.
  - `backend/utils/` – Includes helper functions (e.g., JWT generation).

- **Controllers & Routes:**  
  - `backend/controllers/adminController.js` – Implements endpoints for admin registration, login, user retrieval, reward updates, and more.
  - `backend/routes/adminRoutes.js` – Defines routes with endpoints such as:
    - `POST /api/admin/register` – Register admin.
    - `POST /api/admin/login` – Login admin.
    - `GET /api/admin/auth/google` – Initiate Google OAuth.
    - `GET /api/admin/auth/google/callback` – OAuth callback.
    - `GET /api/admin/users` – Retrieve users.
    - `PATCH /api/admin/users/:id/reward` – Update reward status.

- **Models:**  
  - `backend/models/Admin.model.js`, `User.model.js`, `Reward.model.js` – Mongoose models to handle data storage.

- **Middlewares:**  
  - `backend/middlewares/authMiddleware.js` – Protects endpoints.
  - `backend/middlewares/validate.js` – Validates request bodies using express-validator.

### Frontend

- **Entry Points:**  
  - `frontend/src/main.tsx` – React application bootstrap.
  - `frontend/src/App.tsx` – Defines high-level routes and layout components.

- **Layout & Routing:**  
  - `frontend/src/layout/` – Contains layout components like `AppLayout.tsx`, `AppHeader.tsx`, and `AppSidebar.tsx` to structure the dashboard.
  - `frontend/src/routes/ProtectedRoute.tsx` – Guards protected routes (e.g., user and reward tables).

- **Pages & Components:**  
  - `frontend/src/pages/` – A collection of pages such as authentication (`SignIn.tsx`, `SignUp.tsx`), dashboard (`Home.tsx`), tables (`BasicTables.tsx`, `RewardTable.tsx`), charts (`LineChart.tsx`, `BarChart.tsx`), UI elements (`Badges.tsx`, `Avatars.tsx`), and error pages (`NotFound.tsx`).
  - `frontend/src/components/` – Reusable components (e.g., `PageMeta.tsx`, `ComponentCard.tsx`, `ScrollToTop.tsx`, and a set of icons in `frontend/src/icons/index.ts`).

- **API Integration:**  
  - `frontend/src/api/axios.ts` – Configures the Axios instance for API calls with a base URL pointing to the backend and interceptors to append authentication headers.

- **Styling & Configuration:**  
  - Tailwind CSS configuration is managed via `frontend/postcss.config.js`, `frontend/tsconfig.json`, and additional project configs like `eslint.config.js`, `vite.config.ts`, etc.

---

## Technology Stack

- **Backend:**  
  - Node.js, Express, Mongoose (MongoDB)
  - Passport (Google OAuth)
  - Axios (API consumption on the frontend may also be used in backend services if needed)
  
- **Frontend:**  
  - React 19 with TypeScript
  - Tailwind CSS
  - Vite (for bundling)
  - React Router v6 for routing
  - ApexCharts (for charts)

---

## Installation

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables in `.env` (e.g., database connection string, Google OAuth client, JWT secret).

4. Start the backend server:
   ```bash
   npm run start
   # or
   yarn start
   ```

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. To start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

---

## API Endpoints

The backend exposes several endpoints under the `/api/admin` namespace:

- **Authentication:**
  - `POST /api/admin/register` – Admin registration.
  - `POST /api/admin/login` – Admin login.
  - `GET /api/admin/auth/google` – Initiate Google OAuth.
  - `GET /api/admin/auth/google/callback` – Google OAuth callback.

- **User Management:**
  - `GET /api/admin/users` – Get all registered users.
  - `GET /api/admin/users/rewarded` – Get users with rewards.
  - `GET /api/admin/users/count` – Get total number of users.
  - `GET /api/admin/users/monthly-users` – Get monthly user stats.

- **Reward Management:**
  - `PATCH /api/admin/users/:id/reward` – Update reward status.
  
*(For additional details, refer to the inline comments in the [adminRoutes.js](backend/routes/adminRoutes.js) file.)*

---

## Frontend Flow & Routing

### Routing Overview

Routes are defined using React Router inside `frontend/src/App.tsx`:

- **Authentication Routes:**
  - `/signin` – SignIn page.
  - `/oauth-callback` – OAuth callback handling.
  - `/` (or `/signup`) – SignUp page.

- **Dashboard/Layout Routes (protected):**
  - `/dashboard` – Main dashboard displaying metrics, charts, etc.
  - `/profile` – User profile page.
  - `/user-table` – A protected route for user details in a basic table.
  - `/reward-table` – A protected route for reward management, including feature to download Excel files.

- **Fallback Route:**
  - `*` – Displays the NotFound page.

### Component Flow

- **Layout Components:**  
  `AppLayout.tsx` wraps protected pages using a sidebar (`AppSidebar.tsx`), header (`AppHeader.tsx`), and content area.
  
- **API Integration:**  
  The Axios instance configured in `src/api/axios.ts` dynamically attaches the JWT token (from localStorage) to each request.

- **UI Elements & Controls:**  
  A library of icons in `src/icons/index.ts` and a suite of common components in `src/components/common/` (like `PageMeta.tsx` and `ComponentCard.tsx`) create a consistent UI across pages.

---

## Running the Application

1. **Backend:**  
   Start your backend server:
   ```bash
   npm run start
   ```
   Ensure the database is connected and Passport is properly configured for the OAuth process.

2. **Frontend:**  
   Run the development server:
   ```bash
   npm run dev
   ```
   The application will be accessible, and API calls use the Axios instance pointing to your backend URL (`https://admin-panel-snq4.onrender.com/api/admin`).

---

## Additional Notes

- **CORS Configuration:**  
  The backend uses CORS middleware (in app.js) to allow requests only from authorized origins.

- **JWT Authentication:**  
  Admin authentication is handled via JWT tokens. The frontend automatically attaches the token in API requests via the Axios interceptor.

- **Socket Integration:**  
  Socket.IO initializes in the backend to support real-time functionality (e.g., reward updates).

- **Deployment:**  
  Both frontend and backend deployments are set up with proper configurations (e.g., environment variables, static file serving).

- **Documentation:**  
  This project follows best practices for code organization and is documented through inline comments and this README.

---
