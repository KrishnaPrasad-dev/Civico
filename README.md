# CIVICO

CIVICO is a civic issue reporting platform where citizens can raise local problems, departments can publish official updates, and everyone can track progress in a transparent feed.

## Why CIVICO

Most local civic issues get delayed because reporting is fragmented and updates are not transparent. CIVICO creates a shared workflow where citizens report concerns, departments respond with official updates, and communities track progress end-to-end.

## Highlights

- Citizen issue reporting with status tracking
- Community issue feed with voting and discussion
- Department-led civic posts for advisories and law updates
- Role-aware flows for citizen, department, and admin users
- Mobile-friendly UI built with the Next.js App Router

## Core User Flows

- Citizen flow: sign up, raise issue, monitor updates, comment, vote
- Department flow: sign up as department, publish civic updates, engage in discussions
- Shared flow: transparent feed for public visibility and trust

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- MongoDB + Mongoose
- JWT-based authentication

## Architecture Snapshot

- Frontend: Next.js App Router pages and reusable UI components
- Backend: Route handlers under `app/api/**` for auth, profile, issues, civic posts
- Data: MongoDB models for users, issues, and civic posts
- Auth: JWT token stored client-side and sent as Bearer token for protected APIs

## Role-Based Access

- Citizens and departments can sign up/login with explicit role selection
- Department and citizen accounts are validated during login based on selected role
- Admin role is supported in the schema for platform governance and moderation paths

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` in the project root and configure:

- `MONGODB_URI`
- `JWT_SECRET`

3. Start the development server:

```bash
npm run dev
```

4. Open:

http://localhost:3000

## Scripts

- `npm run dev` - start local development
- `npm run build` - build production app
- `npm run start` - run production build locally
- `npm run lint` - run lint checks

## Portfolio Talking Points

CIVICO demonstrates full-stack product thinking: authentication, role-based user experiences, structured data modeling, API-driven UI, and responsive interaction design focused on real civic workflows.

## Future Improvements

- Media optimization for uploaded issue images
- Notifications for issue status changes
- Department analytics dashboard for SLA and response trends
- Better moderation and audit logs for admin tooling
