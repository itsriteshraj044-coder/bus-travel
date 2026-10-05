# Valmikeshwar Tours & Travels — Bus Booking Website

React 19 + TypeScript + Vite + Tailwind v4, with GSAP (ScrollTrigger), Framer Motion and Lenis smooth scrolling.
Bilingual (मराठी / English), fully responsive.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Features

- Village ⇄ Pune search (33 villages, 32 Pune stops), today/tomorrow chips, swap direction
- Live 45-seat map (available / selected / pending-locked / reserved), max 6 seats, 10-minute hold timer
- Passenger form with validation → booking request (PENDING) → digital QR ticket with confetti,
  print/download and WhatsApp share
- "My Tickets" lookup by mobile number or ticket number
- Admin panel at `/admin` (demo PIN `0413`): dashboard stats, pending queue, confirm / cancel / restore,
  mark paid, WhatsApp the passenger, all-bookings table with search + filter, seat occupancy, printable passenger chart

## Where to edit

- `src/data/config.ts` — business name, phone, WhatsApp, email, address, bus number, fare, timings, admin PIN
- `src/data/locations.ts` — villages and Pune stops
- `src/i18n/strings.ts` — every piece of copy in Marathi and English

## Before going live

Bookings are stored in the browser's `localStorage`, and the admin PIN is checked in the browser.
That's fine for a demo, but for real use bookings must go to a backend/database (e.g. Supabase or Firebase)
so the operator sees bookings made on passengers' phones, and the admin panel needs real authentication.
