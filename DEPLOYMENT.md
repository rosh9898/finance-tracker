# Deploying NexaFlow to Vercel

Follow these steps to make your application live.

## 1. Prepare GitHub Repository

1.  Log in to your [GitHub](https://github.com) account.
2.  Create a **New Repository**.
    *   Name: `nexaflow`
    *   Visibility: **Public** or **Private** (Private is recommended for financial data).
    *   **Do not** initialize with README/gitignore (you already have them).

## 2. Push Local Code

Open your terminal in the project folder and run:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/nexaflow.git

# Rename branch to main if needed
git branch -M main

# Add all files
git add .

# Commit changes
git commit -m "Initial deploy"

# Push to GitHub
git push -u origin main
```

## 3. Deploy on Vercel

1.  Log in to [Vercel](https://vercel.com).
2.  Click **"Add New..."** -> **"Project"**.
3.  Select your `nexaflow` repository and click **Import**.
4.  **Configure Project**:
    *   **Framework Preset**: Next.js (should be auto-detected).
    *   **Root Directory**: `./` (default).
    *   **Build Command**: `prisma generate && next build` (we updated this in package.json).
    *   **Output Directory**: `.next` (default).
5.  **Environment Variables**:
    *   You are using SQLite (`dev.db`). Vercel Serverless functions have an ephemeral file system.
    *   *Note*: For a persistent production app, you typically need a database like **Vercel Postgres**, **PlanetScale**, or **Turso**.
    *   **For this demo**: SQLite will work, but **data will reset** every time you redeploy or after the serverless function goes idle.
    *   **API Keys**: If you are using Google Gemini, add your `GEMINI_API_KEY` here.

6.  Click **Deploy**.

## 4. Final verification

Once deployed, Vercel will give you a domain (e.g., `nexaflow.vercel.app`).
1. Visit the URL.
2. Go to `/settings`.
3. Click **"Load Simulated Data"** to verify the DB is working.
