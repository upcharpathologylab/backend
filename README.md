# Upchar Pathology Home Page

Production-ready Home Page scaffold for Upchar Pathology with a React/Vite frontend and Express/MongoDB backend APIs for admin-manageable home content.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios, Lucide React, Framer Motion
- Backend: Node.js, Express, MongoDB, Mongoose, Multer, JWT

## Project Structure

```text
frontend/
  src/
    api/
    components/
    data/
    pages/
    sections/
backend/
  src/
    config/
    controllers/
    data/
    middleware/
    models/
    routes/
    server.js
```

## Setup

Install frontend dependencies:

```bash
cd frontend
npm install
npm run dev
```

Install backend dependencies:

```bash
cd backend
npm install
npm run dev
```

Set the frontend and backend URLs through environment variables before running or deploying.

## Environment

Backend environment values are in `backend/.env`.

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/upchar_pathology?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-strong-production-secret
CLIENT_URL=https://upcharpathologylab.com,https://www.upcharpathologylab.com
```

Frontend can point to another API URL with:

```env
VITE_API_URL=https://api.upcharpathologylab.com/api
VITE_API_BASE_URL=https://api.upcharpathologylab.com
```

## Public APIs

- `GET /api/home`
- `GET /api/packages/featured`
- `GET /api/tests/featured`
- `GET /api/blogs/featured`
- `GET /api/reviews`
- `POST /api/booking-leads`

`POST /api/booking-leads` accepts multipart form data with:

- `fullName`
- `mobile`
- `city`
- `selectedTestOrPackage`
- `prescriptionFile` optional JPG, PNG, or PDF up to 5MB
- `source`

## Admin APIs

Admin routes require `Authorization: Bearer <token>` signed with `JWT_SECRET`.

- `POST /api/admin/packages`
- `PUT /api/admin/packages/:id`
- `DELETE /api/admin/packages/:id`
- `POST /api/admin/tests`
- `PUT /api/admin/tests/:id`
- `DELETE /api/admin/tests/:id`
- `POST /api/admin/blogs`
- `PUT /api/admin/blogs/:id`
- `DELETE /api/admin/blogs/:id`
- `POST /api/admin/reviews`
- `PUT /api/admin/reviews/:id`
- `DELETE /api/admin/reviews/:id`
- `PUT /api/admin/home-hero`
- `PUT /api/admin/site-settings`

For local testing, generate a temporary admin token after installing backend dependencies:

```bash
node -e "console.log(require('jsonwebtoken').sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' }))"
```

## Fallback Behavior

The Home Page first requests `GET /api/home`. If the backend is unavailable, the frontend uses `frontend/src/data/homeData.js` so the page remains usable. If MongoDB is not connected but the backend is running, public APIs return bundled demo content while booking lead writes return a clear `503` until MongoDB is configured.

## Scope

Only the Home Page and supporting Home Page backend/admin APIs are included. Other website pages are intentionally left out for the next phase.
