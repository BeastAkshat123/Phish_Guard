# 🔌 Supabase Connection - Visual Guide

## Current Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Your App (localhost:5173)                 │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   React Components                        │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │ PhishingScanner (Detect page)                       │ │  │
│  │  │  - Takes user input (URL/email)                     │ │  │
│  │  │  - Analyzes locally                                 │ │  │
│  │  │  - Calls: supabase.from('scan_history').insert()   │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  │                           ↓                               │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │ UserScanHistory (Detect page - below)              │ │  │
│  │  │  - Auto-refreshes every 1.5 seconds                │ │  │
│  │  │  - Calls: supabase.from('scan_history').select()   │ │  │
│  │  │  - Displays all user's scans in table              │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  │                                                            │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │ useAuth Hook (All pages)                            │ │  │
│  │  │  - Manages login/logout                             │ │  │
│  │  │  - Provides user.id for database queries            │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Supabase Client (.env.local)                            │  │
│  │  - URL: https://utnghpygemabnpgvevwt.supabase.co        │  │
│  │  - KEY: sb_publishable_2zEFxEvKD...                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                    🌐 INTERNET 🌐
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Supabase Cloud (Backend)                      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              PostgreSQL Database                          │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │ scan_history table (with RLS policies)            │ │  │
│  │  │                                                    │ │  │
│  │  │ id | user_id | input_text | result | confidence  │ │  │
│  │  │────┼─────────┼────────────┼────────┼─────────────│ │  │
│  │  │ U1 │ USER-1  │ google.com │ safe   │ 95          │ │  │
│  │  │ U2 │ USER-1  │ phish.xyz  │ danger │ 87          │ │  │
│  │  │ U3 │ USER-2  │ example.co │ safe   │ 92          │ │  │
│  │  │    │ (RLS)   │ (hidden)   │ (RLS)  │ (hidden)    │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                          │  │
│  │  Auth Provider (Supabase Auth)                          │  │
│  │  - Handles user registration                           │  │
│  │  - Manages login sessions                              │  │
│  │  - Provides JWT tokens                                 │  │
│  │  - Enforces RLS policies                               │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow - When User Scans

```
1. USER ENTERS URL
   ↓
2. PhishingScanner Component
   ├─ Analyzes URL locally (instant)
   ├─ Determines: safe/phishing/suspicious
   └─ Gets confidence score
   ↓
3. Insert to Supabase
   supabase
     .from('scan_history')
     .insert({
       user_id: "USER-123",        ← From authenticated user
       input_text: "https://...",
       input_type: "url",
       result: "safe",
       confidence: 95,
       risk_factors: [...]
     })
   ↓
4. Supabase Checks RLS Policy
   ├─ "Users can insert their own scans"
   ├─ Verifies: auth.uid() = user_id ✓
   └─ INSERT ALLOWED ✓
   ↓
5. Data Saved to PostgreSQL
   ↓
6. Response Returns to App
   ↓
7. UserScanHistory Component
   ├─ Gets notified
   ├─ Fetches fresh data
   └─ Updates table
   ↓
8. USER SEES RESULT
```

## Data Flow - When User Views History

```
1. USER VISITS DETECT PAGE
   ↓
2. UserScanHistory Component Mounts
   ├─ Calls: supabase.from('scan_history').select(*)
   └─ Auto-refresh timer: every 1.5 seconds
   ↓
3. Supabase Checks RLS Policy
   ├─ "Users can view their own scans"
   ├─ WHERE auth.uid() = user_id
   └─ Only returns current user's scans
   ↓
4. Database Query Results
   ├─ Scan 1: Input "google.com" → safe
   ├─ Scan 2: Input "phish.xyz" → phishing
   └─ (Other users' scans are hidden by RLS)
   ↓
5. Response Returns to App
   ↓
6. Component Displays Table
   ├─ Type | Input | Result | Confidence | Time | Actions
   ├─ URL  │ ...   │ Safe   │ 95%        │ 2min│ Delete
   └─ URL  │ ...   │ Danger │ 87%        │ 5min│ Delete
   ↓
7. USER SEES HISTORY
```

## Setup Process Flow

```
START
  ↓
[.env.local ready] ✓
  ├─ VITE_SUPABASE_URL ✓
  └─ VITE_SUPABASE_PUBLISHABLE_KEY ✓
  ↓
[1] Run SQL in Supabase Dashboard
  ├─ Create scan_history table
  ├─ Create indexes
  ├─ Enable RLS
  └─ Create policies
  ↓
[2] Restart Dev Server
  ├─ npm run dev
  └─ Check Console: "✓ Credentials loaded"
  ↓
[3] User Signs Up
  ├─ Auth stores user in Supabase
  └─ User gets authenticated session
  ↓
[4] User Scans
  ├─ App saves to scan_history
  └─ RLS ensures user_id = auth.uid()
  ↓
[5] User Views History
  ├─ App fetches from scan_history
  └─ RLS returns only that user's scans
  ↓
SUCCESS ✓
```

## RLS (Row Level Security) - How It Works

```
Without RLS:
┌─────────────────┐
│ scan_history    │
├─────────────────┤
│ User-1's scans  │  ← Anyone can see this
│ User-2's scans  │  ← Anyone can see this
│ User-3's scans  │  ← Anyone can see this
└─────────────────┘
⚠️ SECURITY PROBLEM!

With RLS (Our Setup):
┌──────────────────────────┐
│ scan_history table       │
├──────────────────────────┤
│ User-1 policy: show only │
│ WHERE user_id = "U1"     │
│                          │
│ User-1 sees: User-1 ✓    │
│ User-2 sees: User-2 ✓    │
│ User-3 sees: User-3 ✓    │
└──────────────────────────┘
✅ SECURE!
```

## Three Policies We Create

### 1. SELECT Policy (View scans)
```
User can READ scans WHERE user_id matches their auth.uid()
┌─────────────────────┐
│ User-1 → Can see    │
│ - User-1's scans ✓  │
│ - User-2's scans ✗  │
└─────────────────────┘
```

### 2. INSERT Policy (Save scans)
```
User can WRITE scans WHERE user_id matches their auth.uid()
┌──────────────────────────────┐
│ User-1 → Can insert:         │
│ - New scan WITH their ID ✓   │
│ - New scan with other ID ✗   │
└──────────────────────────────┘
```

### 3. DELETE Policy (Remove scans)
```
User can DELETE scans WHERE user_id matches their auth.uid()
┌──────────────────────────────┐
│ User-1 → Can delete:         │
│ - Their own scans ✓          │
│ - Other users' scans ✗       │
└──────────────────────────────┘
```

## Status Check

```
✓ Environment Variables
  - VITE_SUPABASE_URL = configured
  - VITE_SUPABASE_PUBLISHABLE_KEY = configured

✓ Client Setup
  - src/integrations/supabase/client.ts = ready

✓ Authentication
  - src/hooks/useAuth.tsx = implemented

✓ Components
  - PhishingScanner = saves to database
  - UserScanHistory = fetches from database

⏳ Database Setup (NEEDS TO BE DONE)
  - scan_history table = NOT YET CREATED
  - RLS policies = NOT YET CREATED
  - Indexes = NOT YET CREATED
  
NEXT STEP → Run SQL setup in Supabase!
```
