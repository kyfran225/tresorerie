# Deployment Plan for Tresorerie App

This plan outlines the steps taken to prepare the project for deployment to GitHub and Vercel, and addresses the question about using Render.

## Summary of Changes
- Initialized Git repository and committed files.
- Updated `.gitignore` to exclude local database files.
- Modified `src/lib/prisma.ts` and `prisma/seed.ts` to support remote Turso database via environment variables.

## User Review Required

- **Database Choice**: To deploy on Vercel, you cannot use a local SQLite file (`dev.db`). I've prepared the code to use **Turso**, which is a hosted SQLite-compatible database.
- **Render vs Vercel**: You do **not** need Render if you use Vercel combined with a hosted database like Turso. Render is only necessary if you want to keep using a local SQLite file (via persistent disks) or if you prefer their hosting model.
- **Environment Variables**: You will need to provide the following secrets in Vercel:
  - `TURSO_DATABASE_URL`
  - `TURSO_AUTH_TOKEN`
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL`

## Proposed Actions

### 1. GitHub Deployment (Manual Step for User)
I have already prepared the local repository. You need to:
1. Create a new repository named `tresorerie` on your GitHub account: [https://github.com/new](https://github.com/new).
2. Run the following commands in your terminal:
   ```bash
   git remote add origin https://github.com/kyfran225/tresorerie.git
   git branch -M master
   git push -u origin master
   ```

### 2. Vercel Deployment
1. Go to [Vercel](https://vercel.com/new).
2. Import the `tresorerie` repository.
3. In the "Environment Variables" section, add the variables mentioned above.
4. Click "Deploy".

### 3. Database Setup (Turso)
1. Create a database on [Turso](https://turso.tech/).
2. Get the **Database URL** and **Auth Token**.
3. Use these in your Vercel environment variables.

## Verification Plan

### Automated Tests
- I've verified that the `git` commands executed successfully.
- I've verified that the `prisma.ts` file now correctly reads from `process.env`.

### Manual Verification
- The user should verify that the GitHub repository is created and the push is successful.
- The user should verify that the Vercel deployment completes after setting environment variables.
