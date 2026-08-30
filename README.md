# SAVEITRIP — Frontend Prototype

Premium AI travel intelligence platform for India. This is a **frontend-only prototype**:
landing page → demo login/signup → logged-in dashboard. No backend, no real AI, no real auth.

## Stack

- React + TypeScript
- Vite
- Tailwind CSS v4
- react-router-dom (for the 4 routes)

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

## Routes

- `/` — landing page (hero, story sections, destination discovery, pricing)
- `/login` — email/password (any non-empty values work) or "Try Demo Account"
- `/signup` — creates a mock local account
- `/dashboard` — logged-in home screen (redirects to `/login` if not signed in)

## How auth works

There is no backend. Signing in (via the demo button, or the login/signup forms) simply
writes a small user object to `localStorage` under the key `saveitrip_user`. Logging out clears
it. See `src/lib/auth.ts`.

## Project structure

```
src/
  App.tsx            route definitions
  main.tsx            entry point
  index.css          Tailwind + design tokens (colors, fonts)
  data.ts             mock destinations, pricing, demo user, AI copy
  lib/auth.ts          localStorage auth helpers
  components/         Navbar, OutlookBadge, Reveal (scroll animation)
  pages/               Landing, Login, Signup, Dashboard
```

## Notes

- Destination imagery is hotlinked from Unsplash (free-to-use license).
- This prototype intentionally does not implement the AI intelligence engine, payments, or
  real authentication — see the product brief for what's in scope.
