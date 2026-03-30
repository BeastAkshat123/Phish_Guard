# Quick Start: Supabase Integration

## 📋 What's Already Set Up

Your project already has:
- ✅ Supabase client initialized (`src/integrations/supabase/client.ts`)
- ✅ Authentication hooks (`src/hooks/useAuth.tsx`)
- ✅ Type definitions (`src/integrations/supabase/types.ts`)
- ✅ Protected routes component (`src/components/ProtectedRoute.tsx`)

## 🚀 Quick Setup (3 Steps)

### Step 1: Create Supabase Account & Project
```
1. Visit https://supabase.com
2. Sign up and create a new project
3. Wait for initialization (2-5 minutes)
```

### Step 2: Get Your Credentials
```
1. Go to Project Settings > API tab
2. Copy "Project URL" → VITE_SUPABASE_URL
3. Copy "Anon Public" key → VITE_SUPABASE_PUBLISHABLE_KEY
```

### Step 3: Add Credentials to Project
```
1. Open .env.local file in project root
2. Paste your credentials:
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

## 💻 Using Authentication in Your App

### Wrapping Your App (already done in main.tsx):
```typescript
import { AuthProvider } from "@/hooks/useAuth";

<AuthProvider>
  <App />
</AuthProvider>
```

### Using Auth in Components:
```typescript
import { useAuth } from "@/hooks/useAuth";

export function MyComponent() {
  const { user, signIn, signUp, signOut } = useAuth();

  if (!user) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      Welcome, {user.email}!
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

## 📦 Database Setup

Run these SQL commands in Supabase > SQL Editor:

### Create Users Table
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

### Create Scans Table
```sql
create table scans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) on delete cascade,
  url text not null,
  result text,
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

## 🔧 Common Tasks

### Insert Scan Results
```typescript
const { data, error } = await supabase
  .from('scans')
  .insert({
    user_id: user.id,
    url: url,
    result: 'safe', // or 'phishing', 'suspicious'
    risk_score: 15,
    analysis_details: { /* your analysis */ }
  });
```

### Fetch User Scans
```typescript
const { data: scans, error } = await supabase
  .from('scans')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false });
```

### Real-time Subscriptions
```typescript
const subscription = supabase
  .on('postgres_changes', { 
    event: '*', 
    schema: 'public', 
    table: 'scans' 
  }, (payload) => {
    console.log('New scan:', payload);
  })
  .subscribe();
```

## 📁 Project Structure

```
src/
├── integrations/supabase/
│   ├── client.ts          # Supabase client instance
│   └── types.ts           # Database type definitions
├── hooks/
│   └── useAuth.tsx        # Authentication hook
└── components/
    └── ProtectedRoute.tsx # Route protection component
```

## 🔑 Environment Variables

Your `.env.local` file should look like:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1...
```

**Never commit `.env.local` to Git!** It's in `.gitignore` for security.

## 🧪 Testing

1. Start dev server: `npm run dev`
2. Navigate to your app at `http://localhost:8080`
3. Try signing up with an email
4. Check Supabase dashboard > Authentication to verify user was created

## ⚠️ Important Security Notes

- Always use the **Anon Public** key for frontend, never the service role key
- Row Level Security (RLS) policies protect user data
- Users can only see/modify their own data
- Never expose secrets in your code

## 📚 Next Steps

1. Update database schema to match your requirements
2. Create reusable queries/hooks for common operations
3. Set up real-time listeners for live updates
4. Configure authentication providers (Google, GitHub, etc.)

## 🆘 Need Help?

- Full setup guide: See `SUPABASE_SETUP.md`
- Supabase docs: https://supabase.com/docs
- React examples: https://supabase.com/docs/guides/getting-started/quickstarts/reactjs
