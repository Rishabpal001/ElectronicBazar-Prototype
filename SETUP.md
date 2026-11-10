# Electronic Bazar - Setup (Hinglish)

## 1. Supabase
1. SQL Editor me ek ek karke, is order me run karo:
   `supabase/migrations/0001_schema.sql` -> `0002_rls.sql` -> `0003_functions.sql` -> `0004_storage.sql` -> `0005_batch2.sql` -> `0006_electronics.sql` -> `supabase/seed_electronics.sql`
2. Authentication -> Sign In / Providers: Email ON, Google ON (Client ID + Secret Google Cloud se; Google Cloud me redirect URI = `https://<project-ref>.supabase.co/auth/v1/callback`).
3. Authentication -> URL Configuration:
   - Site URL: `https://rishabpal001.github.io/ElectronicBazar-Prototype/`
   - Redirect URLs (Add URL se teeno): 
     `https://rishabpal001.github.io/ElectronicBazar-Prototype/`
     `https://rishabpal001.github.io/ElectronicBazar-Prototype/reset-password`
     `http://localhost:5173/`
4. Project Settings -> API: Project URL aur anon/publishable key copy karo (service_role kabhi nahi).

## 2. GitHub Variables (Secrets nahi!)
Repo -> Settings -> Secrets and variables -> Actions -> **Variables** tab:
`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SITE_NAME` (= Electronic Bazar), `VITE_SITE_URL` (= https://rishabpal001.github.io/ElectronicBazar-Prototype/), `VITE_CONTACT_EMAIL`. Optional: `VITE_SALE_ENDS`.

## 3. Deploy
- Settings -> Pages -> Source = **GitHub Actions** (yahi white page ka sabse bada kaaran hota hai).
- Actions tab -> "Deploy to GitHub Pages" -> Run workflow. Green hone par site par Ctrl+Shift+R.
- `.github/workflows/deploy.yml` repo me hona zaroori hai (dot-folder web upload me skip ho jata hai; Add file -> Create new file se banao).

## 4. Admin banana
Site par ek baar Google/email se login karo, phir SQL Editor:
`update public.profiles set role = 'admin' where email = 'TUMHARA_EMAIL';`

## Local
`cp .env.example .env` (values bharo) -> `npm install` -> `npm run dev`. Tests: `npm test`. Typecheck: `npm run typecheck`.

## Razorpay (optional)
Supabase -> Edge Functions -> Secrets: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET. Functions `razorpay-create-order`, `razorpay-verify`, `razorpay-webhook` (webhook me Verify JWT OFF) deploy karo. Razorpay webhook URL: `https://<ref>.supabase.co/functions/v1/razorpay-webhook`, events payment.captured + order.paid. Phir Admin -> Settings -> "Allow online payment".
