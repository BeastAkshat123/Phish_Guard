# 🔌 Connect Phishing Guard to Supabase - Complete Setup Guide

## ✅ Your Project Status

Your `.env.local` file is already configured with Supabase credentials:
- ✓ Supabase URL is set
- ✓ Publishable key is set
- ✓ Environment variables are ready

## 📋 Steps to Complete Setup

### Step 1: Verify Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Check that your project exists and is active
4. Note the project ID: `hgbzoqojgjpbfsngviyd`

### Step 2: Create Database Tables

Run these SQL commands in your Supabase SQL Editor:

#### Option A: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the SQL from the next section
5. Click "Run"

#### Option B: Run Migrations
```bash
npx supabase db push
```

### Step 3: SQL to Run (Copy-Paste into Supabase SQL Editor)

```sql
-- Create scan_history table
CREATE TABLE IF NOT EXISTS public.scan_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL,
  input_type TEXT NOT NULL CHECK (input_type IN ('url', 'email')),
  result TEXT NOT NULL CHECK (result IN ('safe', 'phishing', 'suspicious')),
  confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  risk_factors JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scan_history_user_id ON public.scan_history(user_id);
CREATE INDEX IF NOT EXISTS idx_scan_history_created_at ON public.scan_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scan_history_user_created ON public.scan_history(user_id, created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own scans
CREATE POLICY "Users can view their own scans" 
ON public.scan_history 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can insert their own scans
CREATE POLICY "Users can insert their own scans" 
ON public.scan_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own scans  
CREATE POLICY "Users can delete their own scans" 
ON public.scan_history 
FOR DELETE 
USING (auth.uid() = user_id);

-- Optional: Create a stats table for aggregate data
CREATE TABLE IF NOT EXISTS public.user_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  total_scans INTEGER DEFAULT 0,
  safe_count INTEGER DEFAULT 0,
  phishing_count INTEGER DEFAULT 0,
  suspicious_count INTEGER DEFAULT 0,
  last_scanned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own stats" 
ON public.user_stats 
FOR SELECT 
USING (auth.uid() = user_id);
```

### Step 4: Test the Connection

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser** to http://localhost:5173

3. **Check the console** (F12 > Console):
   - You should see: `✓ Supabase credentials loaded from .env.local`
   - You should see: `✓ Project URL: https://utnghpygemabnpgvevwt.supabase.co`

4. **Sign up / Sign in** to create a user account

5. **Perform a scan** and check if it saves to the database:
   - Open DevTools Console (F12)
   - You should see: `Saving scan for user: [user-id]`
   - You should see: `Scan saved successfully`

### Step 5: Verify Database Data

1. Go to Supabase Dashboard
2. Click "Table Editor" in the left sidebar
3. Select `scan_history` table
4. You should see your scans appear here

## 🚨 Troubleshooting

### Error: "Failed to load scan history"
- Check that RLS policies are created
- Verify user_id is being set in the insert
- Check browser console for detailed error

### Error: "Supabase environment variables are missing"
- Make sure `.env.local` file exists
- Check that both `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are set
- Restart the dev server after editing `.env.local`

### Scans not saving
- Open DevTools Console (F12)
- Look for "Database insert error" messages
- Check that user is authenticated
- Verify RLS policies are correct

### Still getting errors?
1. Check browser Console (F12 > Console tab)
2. Look for detailed error messages
3. Screenshot the error and share it

## ✨ What's Configured

- ✅ Environment variables in `.env.local`
- ✅ Supabase client initialized in `src/integrations/supabase/client.ts`
- ✅ Authentication set up in `src/hooks/useAuth.tsx`
- ✅ Database queries in components using supabase client
- ✅ RLS policies for security

## 🔐 Security Notes

- Never commit `.env.local` to git (it's in .gitignore)
- Keep your publishable key safe
- RLS policies ensure users can only see their own data
- All scans are tied to authenticated users
