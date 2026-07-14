# StudyNotes 📚

A shared library for biology, chemistry & physics notes. Visitors browse and
download; your sister uploads new notes from a passcode-protected page.

- **Public:** homepage, subject pages, search, filter/sort, note viewer + download
- **Admin:** `/admin` — passcode-gated upload form
- **Theme:** academic purple + green
- **Stack:** Next.js (App Router) + Supabase (free tier storage + database)

---

## Setup — about 15 minutes, no coding needed

### 1. Create a Supabase project (free)
1. Go to https://supabase.com → sign up → **New project**.
2. Give it a name and a database password, pick a region, click **Create**.

### 2. Set up the database + storage
1. In the project, open **SQL Editor → New query**.
2. Paste everything from `supabase-setup.sql` and click **Run**.
3. Open **Storage → New bucket**. Name it exactly `notes` and turn ON
   **Public bucket**. Save.

### 3. Get your keys
1. Open **Project Settings → API**.
2. Copy the **Project URL** and the **anon public** key.

### 4. Add your environment values
1. Copy `.env.local.example` to `.env.local`.
2. Paste your URL and anon key.
3. Set `NEXT_PUBLIC_ADMIN_PASSWORD` to any passcode you like — this is what
   your sister types to reach the upload page.

### 5. Run it locally (optional, to test)
```bash
npm install
npm run dev
```
Open http://localhost:3000

### 6. Deploy it live (free) with Vercel
1. Push this folder to a new GitHub repo.
2. Go to https://vercel.com → **Add New → Project** → import the repo.
3. In **Environment Variables**, add the same three values from `.env.local`.
4. Click **Deploy**. You get a live URL to share. 🎉

---

## Everyday use
- **Add a note:** go to `yoursite.com/admin`, enter the passcode, fill the
  form, choose a PDF or image, and publish. It appears instantly.
- **Find notes:** search on the homepage, or open a subject and sort by newest
  or most-downloaded.

## Notes on security
The passcode gate keeps casual visitors off the upload page. Because uploads
happen from the browser with the public anon key, treat this as a
"trusted family" setup rather than a bank. If you later want stronger
protection, swap the passcode for Supabase Auth and lock the insert policy to
signed-in users — the table and policies are already in `supabase-setup.sql`
ready to tighten.

## Customizing
- **Colors:** edit the CSS variables at the top of `app/globals.css`.
- **Subjects/blurbs:** edit `SUBJECT_META` in `lib/supabase.ts`.
- **Site name:** edit the brand in `app/layout.tsx`.
