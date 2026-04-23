# PushUp Pro

A minimal, beautiful PWA for tracking daily push-ups (or any rep-based exercise). Built with React, Vite, and TypeScript. Designed mobile-first with a liquid-glass aesthetic.

Live demo: _(deploy to Vercel and update this link)_

## Features

- **One-tap logging** — two customizable quick-add buttons (default `+15` / `+20`)
- **Daily goal ring** — animated conic progress indicator with a gradient stroke
- **Streak tracking** — current streak, best streak, and 7-day rolling total
- **30-day trend chart** — bar chart of the last 30 days (powered by Recharts)
- **Monthly summary** — total, daily average, and max reps for the selected month
- **Interactive calendar** — navigate any month, see which days you hit the mat
- **Data export / import** — back up or migrate your history as a JSON file
- **PWA** — installable on iOS/Android home screen, offline-capable via Service Worker
- **Local-first** — all data stored in `localStorage`; no account, no tracking, no backend

## Tech Stack

- React 19 + TypeScript
- Vite 6 (build tool & dev server)
- Tailwind CSS (via CDN, configured inline in `index.html`)
- Recharts (trend chart)
- Lucide React (icons)

## Run Locally

**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev
```

The app will be available at http://localhost:3000.

## Build for Production

```bash
npm run build    # outputs to dist/
npm run preview  # serves the built app locally
```

## Deploy to Vercel

1. Push this repo to GitHub (already done if you're reading this here).
2. Go to [vercel.com](https://vercel.com), sign in with GitHub, and click **Add New → Project**.
3. Import `PushUp-Pro`. Vercel auto-detects Vite — no configuration needed.
4. Click **Deploy**.

Every subsequent `git push` to `main` will redeploy automatically.

## Installing as a PWA

After deploying (or on localhost):

- **iOS**: Open in Safari → Share → *Add to Home Screen*
- **Android**: Open in Chrome → Menu → *Install app*
- **Desktop (Chrome/Edge)**: Click the install icon in the address bar

The app runs full-screen, respects the device's safe areas, and works offline.

## Project Structure

```
├── App.tsx                    # Root: state, localStorage, handlers
├── index.tsx                  # React entry point
├── index.html                 # HTML shell + Tailwind CDN + global styles
├── sw.js                      # Service Worker for offline support
├── manifest.json              # PWA manifest
├── types.ts                   # Shared TypeScript types
└── components/
    ├── Header.tsx             # Date header
    ├── HomeView.tsx           # Progress ring + buttons + settings modal
    ├── StatsView.tsx          # Streaks + trend chart + month summary + calendar
    ├── BottomNav.tsx          # Home / Stats toggle
    └── ui/                    # Reusable primitives (Button, Card, Modal)
```

## Data Model

All app state lives under the `pushup-pro-data-v2` key in `localStorage`:

```typescript
interface AppState {
  logs: { date: string; count: number }[];  // date is "YYYY-MM-DD"
  dailyTarget: number;                      // default 50
  shortcuts: number[];                      // two quick-add values
}
```

Export produces a JSON file of this exact shape, so you can hand-edit your history if you want.

## Roadmap

Ideas for future iterations:

- Push notifications / daily reminders (Service Worker + Notifications API)
- Progressive-overload mode (auto-raise daily goal after streak milestones)
- Set/rep breakdown (log "4 × 20" instead of a single daily number)
- Cloud sync (iCloud, Supabase, or similar)
- Multiple exercise types (pull-ups, squats, crunches)
- Dark mode

## License

MIT — do whatever you like.
