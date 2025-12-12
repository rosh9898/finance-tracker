# Deploying Casflow Dashboard

Since this is a Next.js application, the best way to deploy is using **Vercel**.

## Option 1: Vercel CLI (Recommended)

1.  **Install Vercel CLI** (if not installed):
    ```bash
    npm i -g vercel
    ```

2.  **Login to Vercel**:
    ```bash
    vercel login
    ```

3.  **Deploy**:
    Run the following command in your project root:
    ```bash
    vercel
    ```
    - Set up and deploy? **Y**
    - Which scope? **(Select your account)**
    - Link to existing project? **N** (or Y if you have one)
    - Project Name? **casflow-dashboard**
    - Directory? **./**
    - Modify settings? **N** (Defaults are fine for Next.js)

4.  **Production Deploy**:
    Once you are happy with the preview, ship to production:
    ```bash
    vercel --prod
    ```

## Option 2: Push to GitHub & Vercel Dashboard

1.  **Push your code to GitHub**:
    ```bash
    git add .
    git commit -m "Initial Casflow Build"
    git push origin main
    ```

2.  **Go to Vercel Dashboard**:
    - Log in to [vercel.com](https://vercel.com).
    - Click **"Add New..."** -> **"Project"**.
    - Import your `finance-tracker` (or `webapp`) repository.
    - Click **Deploy**.

## Environment Variables

If you add backend features (like Gemini API or Database) later, remember to add your `.env` variables in the Vercel Project Settings > Environment Variables.
