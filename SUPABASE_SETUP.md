# Supabase Setup Guide

This guide will help you set up Supabase for the Phishing Guard project.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project" button
3. Fill in the project details:
   - **Project Name**: Phishing Guard (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose the region closest to you
4. Click "Create new project" and wait for it to initialize

## Step 2: Get Your Credentials

1. Once your project is ready, go to **Project Settings** (gear icon)
2. Select the **API** tab from the left sidebar
3. Under **Project URL**, copy the URL (starts with `https://...supabase.co`)
4. Under **Project API keys**, find and copy the **Anon Public** key
5. You now have:
   - `VITE_SUPABASE_URL`: Your project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your anon public key

## Step 3: Configure Environment Variables

1. Open `.env.local` file in your project root
2. Replace the placeholder values with your actual credentials:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-public-key
   ```

## Step 4: Set Up Database Tables

1. Go to the **SQL Editor** in your Supabase dashboard
2. Create the following tables for scan history and user data:

### Users Table
```sql
create table users (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table users enable row level security;

create policy "Users can read their own data"
  on users for select
  using (auth.uid() = id);
```

### Scans Table
```sql
create table scans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) on delete cascade,
  url text not null,
  result text, -- 'safe', 'phishing', 'suspicious'
  risk_score integer default 0,
  analysis_details jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table scans enable row level security;

create policy "Users can read their own scans"
  on scans for select
  using (auth.uid() = user_id);

create policy "Users can insert their own scans"
  on scans for insert
  with check (auth.uid() = user_id);
```

## Step 5: Set Up Authentication (Optional)

1. Go to **Authentication** > **Providers** in your Supabase dashboard
2. Enable the providers you want (Email, Google, GitHub, etc.)
3. Configure the redirect URLs if using OAuth

For Email provider:
- Confirm email is enabled by default
- Users will need to verify their email

## Step 6: Test the Connection

1. Run `npm install` to install/update dependencies
2. Run `npm run dev` to start the development server
3. The Supabase client should now be connected
4. Check browser console for any errors

## Step 7: Use Supabase in Your Code

### Importing the client:
```typescript
import { supabase } from "@/integrations/supabase/client";
```

### Example: Insert a scan
```typescript
const { data, error } = await supabase
  .from('scans')
  .insert({
    user_id: user.id,
    url: 'https://example.com',
    result: 'safe',
    risk_score: 10,
    analysis_details: { /* your analysis */ }
  });

if (error) {
  console.error('Error inserting scan:', error);
} else {
  console.log('Scan saved:', data);
}
```

### Example: Fetch user scans
```typescript
const { data: scans, error } = await supabase
  .from('scans')
  .select('*')
  .order('created_at', { ascending: false });

if (error) {
  console.error('Error fetching scans:', error);
} else {
  console.log('Scans:', scans);
}
```

## Step 8: Deploy

When deploying your application:
1. Add environment variables to your hosting platform (Vercel, Netlify, etc.)
2. Make sure `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are set
3. Deploy your application

## Troubleshooting

### "Cannot find module" errors
- Make sure you've installed dependencies: `npm install`
- Restart your development server: `npm run dev`

### "Invalid API key" error
- Check that your API keys are correct in `.env.local`
- Make sure you're using the **Anon Public** key, not the service role key

### CORS errors
- Go to **Project Settings** > **API** > **Authorized redirect URLs**
- Add your development and production URLs

### Row Level Security (RLS) issues
- Check that RLS policies are correctly set up
- Use the SQL Editor to verify policies exist
- For development, you can temporarily disable RLS (not recommended for production)

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase React Integration](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs)
- [Supabase Database Guide](https://supabase.com/docs/guides/database)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
