# Quick Setup Guide

## Prerequisites
- Node.js 18+ installed
- A Supabase account (free tier works)

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for the project to be provisioned (takes ~2 minutes)

### 3. Get Supabase Credentials
1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (also starts with `eyJ...`)

### 4. Configure Environment Variables
Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Important:** Replace the placeholder values with your actual Supabase credentials!

### 5. Database Setup
The database has already been set up via migrations. You don't need to do anything manually.

A default admin account is created automatically:
- **Username:** `admin`
- **Password:** `admin123`

### 6. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## First Steps

### For Administrators
1. Click "Admin Login" button
2. Login with `admin` / `admin123`
3. Start adding questions to different subjects

### For Users
1. Questions must be added by admin first
2. Select a subject from the homepage
3. Take the quiz
4. View your results

## Building for Production
```bash
npm run build
npm run start
```

## Common Issues

### Build fails with environment variable errors
- Make sure `.env.local` file exists
- Verify all three environment variables are set
- Restart the dev server after changing `.env.local`

### Can't login as admin
- Check that database migrations ran successfully
- Default credentials are `admin` / `admin123`
- Password is case-sensitive

### No subjects showing on homepage
- Admin must add questions first
- Refresh the page after adding questions
- Check browser console for API errors

## Project Structure Quick Reference

```
app/
├── page.tsx                    # Homepage (subject selection)
├── admin/
│   ├── login/page.tsx         # Admin login
│   └── dashboard/page.tsx     # Question management
└── quiz/
    └── [subject]/
        ├── page.tsx           # Quiz interface
        └── result/page.tsx    # Results page

api/
├── admin/                     # Admin authentication APIs
├── questions/                 # Question CRUD APIs
├── subjects/                  # Get subjects API
└── quiz/submit/              # Submit quiz API
```

## Need Help?

Check the main README.md for detailed documentation about:
- Database schema
- API endpoints
- Features explanation
- Technologies used
