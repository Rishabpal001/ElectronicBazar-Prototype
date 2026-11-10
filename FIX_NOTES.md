# Is update me kya badla (Hinglish)

Verified (sandbox me): `npm ci`, `npm test` (80 pass), `tsc --noEmit` (0 error), `npm run build`, aur headless Chrome me site render.

1. `index.html`  - safety net: app start na ho to white page ki jagah laal box me wajah dikhata hai (Pages Source galat / script 404 / JS error).
2. `src/main.tsx` - ErrorBoundary + startup error box. Missing Supabase env par app band nahi hoti; app apna "Setup needed" banner dikhati hai.
3. `.github/workflows/deploy.yml` - typecheck (non-blocking) + 404.html SPA fallback.
4. Type errors fix: `src/lib/api.ts`, `src/lib/orders.ts`, `src/lib/types.ts`, (Order.razorpay_payment_id).
5. `SETUP.md` Electronic Bazar ke hisaab se, `.env.example` add.

Jo main verify NAHI kar sakta: tumhara GitHub Pages setting, Actions run, Supabase/Google login. White page ka asli kaaran ~99% Settings -> Pages -> Source "GitHub Actions" na hona ya Actions deploy fail hona hai.
