# Polymerica — Development notes

This branch (refactor/full-improvement) contains refactors and infrastructure changes.

Server-side/Deployment notes:
- Static pages (like prices.html) now expect a server-side endpoint `/api/prices` that returns a JSON array of price objects (fields: material, grade, price_toman, unit, update_date).
- This avoids embedding Supabase keys in client-side HTML. Implement a small serverless function or proxy on your hosting platform that queries Supabase using the admin/anon key on the server and returns the data.

Local dev:
- Copy `.env.example` to `.env.local` and set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY for client-side parts.

