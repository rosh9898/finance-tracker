# Upgrade to Persistent Database (Vercel Postgres)

Since Vercel's default file system is temporary (meaning SQLite data gets deleted), you should switch to **Vercel Postgres** for a free, persistent database.

## Step 1: Create Database on Vercel
1.  Go to your project on the [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click the **"Storage"** tab at the top.
3.  Click **"Connect Store"** -> **"Create New"** -> **"Postgres"**.
4.  Accept the terms and click **"Create"**.
5.  Select your region (e.g., Washington D.C.) and click **"Create"**.

## Step 2: Connect to Project
1.  Once created, click **"Connect Project"** and select your `finance-tracker` project.
2.  This automatically adds environment variables (`POSTGRES_URL`, etc.) to your Vercel deployment.

## Step 3: Update Local Code
Now we need to tell your app to use this new database instead of SQLite.

1.  **Pull Environment Variables** to your local machine:
    ```bash
    npm i -g vercel
    vercel link
    vercel env pull .env.development.local
    ```
    *(Or manually copy the `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING` from Vercel Storage settings to your local `.env` file as `DATABASE_URL` and `DIRECT_URL`)*.

2.  **Update `prisma/schema.prisma`**:
    Change the `datasource` block to:
    ```prisma
    datasource db {
      provider = "postgresql"
      url      = env("POSTGRES_PRISMA_URL") // uses connection pooling
      directUrl = env("POSTGRES_URL_NON_POOLING") // uses a direct connection
    }
    ```

3.  **Push Changes**:
    ```bash
    git add .
    git commit -m "Switch to Vercel Postgres"
    git push
    ```

Vercel will redeploy, and this time your data will be permanent!
