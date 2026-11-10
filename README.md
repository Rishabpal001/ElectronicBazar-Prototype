# Electronic Bazar

Electronics store (React + Vite + Tailwind + Supabase), deployed on GitHub Pages.
Backend (login, cart, address, checkout, COD, Razorpay, orders, admin panel) is the same as the Birthday Card Store.

## Setup / update steps (Hinglish)

1. Is zip ki saari files repo me replace karo (`.github` folder ke saath), commit + push.
2. Supabase SQL Editor me ek ek karke run karo:
   - `supabase/migrations/0006_electronics.sql`  (brand, warranty, key specs columns; data delete nahi hota)
   - `supabase/seed_electronics.sql`  (10 demo [SAMPLE] products + 10 categories; purane birthday demo products sirf hide hote hain)
   - Agar naya project hai to pehle `0001` se `0005` bhi order me run karo.
3. GitHub -> Settings -> Variables: `VITE_SITE_NAME` = `Electronic Bazar`. Optional: `VITE_SALE_ENDS` = `2026-12-31T23:59:00+05:30` (Home page par asli countdown dikhega; na daalo to countdown nahi dikhta).
4. Admin panel -> Products me photos upload karo (white/transparent background wali photos best lagti hain), brand / warranty / key specs bharo, sample products delete karo.

Local run: `npm install` then `npm run dev`. Tests: `npm test`.
