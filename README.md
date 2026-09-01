# SAVEITRIP — Frontend

Premium AI travel intelligence platform for India. This is the React frontend for the
SaveiTrip monorepo. It talks to the Express backend in `../backend` over `/api`.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4 (`@tailwindcss/vite`)
- react-router-dom

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`). The Vite dev server
proxies `/api` requests to `http://localhost:4000`, so the backend must be running too
(see `../backend`).

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check (`tsc -b`) then produce a production bundle
- `npm run preview` — preview the production build

## Routes

- `/` — landing page
- `/login` — email/password login or "Try Demo Account"
- `/signup` — create an account
- `/auth/google/callback` — Google OAuth redirect handler
- `/dashboard` — logged-in home screen (auth required)
- `/trips/new` — trip consultation (auth required)
- `/comparison` — deal comparison search (auth required)
- `/prediction` — prediction (auth required, placeholder)
- `/sos` — emergency SOS research (auth required, placeholder)
- `/profile` — user profile (auth required)
- `/services` — redirects to `/dashboard`
- `*` — public 404 page

Unknown routes show a public 404 (no auth required). All other protected routes redirect
to `/login` when signed out.

## Project structure

```
src/
  main.tsx                 entry point
  App.tsx                  route definitions
  index.css                Tailwind + design tokens (colors, fonts, animations)
  auth/                    auth API client, AuthContext, login/signup, ProtectedRoute
  shared/                  AppShell (authenticated layout), ServiceDetail, services
  dashboard/               DashboardPage
  comparison/              ComparisonPage + comparisonApi
  prediction/              PredictionPage
  sos/                     SosPage
  trips/                   TripConsultationPage
  profile/                 ProfilePage
  hooks/                   useReveal (scroll-reveal hook)
```

## Notes

- Authentication is handled by the backend (JWT, stored by `AuthContext`); see `../backend`.
- Some modules (prediction, SOS, trips) are functional shells awaiting backend work.
