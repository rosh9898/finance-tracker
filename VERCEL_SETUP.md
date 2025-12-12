# Vercel Deployment Guide

Your code is now ready for Vercel! Follow these exact steps to launch your app.

## Step 1: Create a GitHub Repository
1.  Go to [GitHub.com](https://github.com) and create a new repository (e.g., `finance-tracker`).
2.  Open your terminal in this folder and run:
    ```bash
    git init
    git add .
    git commit -m "Initial commit for Vercel"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/finance-tracker.git
    git push -u origin main
    ```
    *(Replace `YOUR_USERNAME` with your actual GitHub username)*

## Step 2: Set up Database (Vercel Postgres)
1.  Go to [Vercel.com](https://vercel.com) and log in.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your `finance-tracker` repository.
4.  **Before clicking Deploy**:
    *   On the left sidebar (or in the setup menu), look for **Storage**.
    *   Click **"Create"** next to **Postgres**.
    *   Accept the terms and create the database (Location: Washington D.C. or closest to you).
    *   Once created, Vercel will automatically add the `POSTGRES_PRISMA_URL` (and others) to your project environment variables.
    *   **Crucial**: You need to map the Vercel Postgres variable to `DATABASE_URL`.
        *   In your Project Settings -> Environment Variables.
        *   Add a new variable: `DATABASE_URL`.
        *   Value: Copy the value from `POSTGRES_PRISMA_URL` (or System Environment Variable link).

## Step 3: Configure Environment Variables
In the "Environment Variables" section of the deployment screen (or Settings), ensure you have:

*   `GEMINI_API_KEY`: (Paste your Gemini API key here)
*   `DATABASE_URL`: (Your Postgres connection string)

## Step 4: Deploy & Push Schema
1.  Click **Deploy**.
2.  Wait for the build to finish.
3.  **One last step**: The database is empty! You need to push your schema.
    *   Go to your Vercel Project Dashboard.
    *   Click on the **"Storage"** tab -> Select your database.
    *   Go to the **"Query"** tab (or "Data").
    *   Does it allow running commands? Usually, you do this from your local machine connecting to the remote DB.
    *   **Better way**: Connect your local terminal to Vercel.
        ```bash
        npm i -g vercel
        vercel link
        vercel env pull .env.development.local
        npx prisma db push
        ```
    *   This will push your schema (`User`, `Income`, `Goal`, etc.) to the production database.

## Validation
Visit your Vercel URL (e.g., `finance-tracker.vercel.app`). Your app should be live, fast, and persistent! 🚀
