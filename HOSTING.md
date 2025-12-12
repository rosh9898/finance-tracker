# How to Host FinanceTrack

You have two main paths to host this application. Since it currently uses **SQLite** (a file-based database), you cannot simply deploy it to standard serverless platforms like Vercel/Netlify without changing the database, as they will delete your database file on every update.

## Method 1: Vercel + Cloud Database (Recommended 🌟)
*Best for speed, performance, and "set it and forget it".*

1.  **Switch Database to Postgres**:
    *   Sign up for a free Postgres database on [Vercel Storage](https://vercel.com/docs/storage/vercel-postgres) or [Neon.tech](https://neon.tech).
    *   Get the `DATABASE_URL` connection string.
    *   Update `prisma/schema.prisma`:
        ```prisma
        datasource db {
          provider = "postgresql" // change from sqlite
          url      = env("DATABASE_URL")
        }
        ```
    *   Delete the `migrations` folder if you have one locally (or just reset).

2.  **Push to GitHub**:
    *   Initialize Git: `git init`
    *   Commit changes: `git add . && git commit -m "Ready for deploy"`
    *   Push to a new GitHub repository.

3.  **Deploy on Vercel**:
    *   Go to Vercel, "Add New Project", and select your GitHub repo.
    *   In **Environment Variables**, add:
        *   `DATABASE_URL`: (Your cloud database string)
        *   `GEMINI_API_KEY`: (Your AI key)
    *   Click **Deploy**. Vercel handles the rest!

---

## Method 2: VPS (DigitalOcean, AWS, Railway)
*Best if you really want to keep SQLite.*

**Railway/Render (Easier):**
1.  Connect your GitHub repo.
2.  **Crucial**: You MUST create a generic "Volume" or "Disk" and mount it to the path where your `dev.db` exists. If you don't do this, you will lose your data every time you redeploy.
3.  Set the start command to: `npx prisma db push && npm start`.

**Ubuntu VPS (Harder):**
1.  Rent a cheap VPS ($5/mo).
2.  Install Node.js 18+.
3.  Clone your repo.
4.  Run `npm install` -> `npm run build`.
5.  Use **PM2** to keep it running: `pm2 start npm --name finance-app -- start`.
6.  Use **Nginx** to point your domain to port 3000.
