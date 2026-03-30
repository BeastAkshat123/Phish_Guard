# 📋 Supabase Integration - Visual Setup Guide

## 🎯 The 3-Minute Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR PROJECT TODAY                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ✅ Frontend (React + TypeScript)                            │
│  ✅ UI Components (shadcn-ui + Tailwind)                     │
│  ✅ Phishing Detection Logic                                 │
│  ✅ Supabase Client Configured                               │
│  ✅ Authentication System Ready                              │
│  ✅ Database Connection Ready                                │
│                                                               │
│  ⏳ MISSING: Your Supabase Project Credentials               │
│                                                               │
└─────────────────────────────────────────────────────────────┘

YOUR NEXT 3 STEPS:

1️⃣  Create Supabase Project (2 min)
    → https://supabase.com → "New Project"

2️⃣  Get Credentials (1 min)
    → Project Settings > API tab
    → Copy 2 values into .env.local

3️⃣  Create Database Tables (1 min)
    → Copy-paste SQL from SUPABASE_SETUP.md

✅ DONE! Your app is connected to Supabase
```

## 📊 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERACTION                          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              PHISHING GUARD APPLICATION                      │
│  (React + TypeScript + Tailwind CSS)                         │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Components:                                         │   │
│  │ • PhishingScanner.tsx (URL input)                   │   │
│  │ • ScanHistory.tsx (Results)                         │   │
│  │ • StatsBar.tsx (Statistics)                         │   │
│  │ • Auth pages (Login/Signup)                         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    ┌──────────────────┐
                    │ Analysis Engine  │
                    │ (Phishing Logic) │
                    └──────────────────┘
                              ↓
                    ┌──────────────────┐
                    │ Supabase Client  │
                    │ (supabase.js)    │
                    └──────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE BACKEND                          │
│                                                               │
│  🔐 Authentication                                           │
│     └─ auth.users (Email/Password, OAuth)                   │
│                                                               │
│  📦 Database                                                 │
│     ├─ users (User profiles)                                │
│     └─ scans (Scan history & results)                       │
│                                                               │
│  🛡️ Row Level Security (RLS)                               │
│     └─ Users can only see their own data                    │
│                                                               │
│  ⚡ Real-Time                                                │
│     └─ Live updates via WebSocket                           │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow: Scanning a URL

```
USER INPUT
    ↓
"Enter URL to scan: https://example.com"
    ↓
ANALYSIS ENGINE
    ↓ (analyzes URL for phishing indicators)
RESULT
    ↓
"Risk Score: 15/100, Result: SAFE"
    ↓
SAVE TO SUPABASE
    ↓
INSERT INTO scans (
    user_id: current_user.id,
    url: "https://example.com",
    result: "safe",
    risk_score: 15,
    analysis_details: {...}
)
    ↓
DISPLAYED IN SCAN HISTORY
    ↓
USER SEES RESULT IN INTERFACE
```

## 📁 Files You Need to Understand

```
.env.local
├─ VITE_SUPABASE_URL = Your project URL
└─ VITE_SUPABASE_PUBLISHABLE_KEY = Your anon key

src/integrations/supabase/
├─ client.ts .............. Creates Supabase client
├─ types.ts ............... Database types
└─ queries.ts ............. Utility functions ✨ NEW

src/hooks/
└─ useAuth.tsx ............ Authentication management

.gitignore
└─ Protects .env.local from Git
```

## ⚙️ Setup Sequence

```
STEP 1: Create Supabase Project
┌──────────────────────────────┐
│ Go to https://supabase.com   │
│ Click "New Project"          │
│ Fill form                    │
│ Wait for initialization      │
└──────────────────────────────┘
           ↓
STEP 2: Get Credentials
┌──────────────────────────────┐
│ Project Settings > API       │
│ Copy: Project URL            │
│ Copy: Anon Public Key        │
│ (NOT Service Role Key!)      │
└──────────────────────────────┘
           ↓
STEP 3: Configure .env.local
┌──────────────────────────────┐
│ Open: .env.local             │
│ Paste: VITE_SUPABASE_URL     │
│ Paste: VITE_SUPABASE_...KEY  │
│ Save: File                   │
└──────────────────────────────┘
           ↓
STEP 4: Create Database Tables
┌──────────────────────────────┐
│ Supabase > SQL Editor        │
│ Copy SQL from SUPABASE_...md │
│ Execute: Users table         │
│ Execute: Scans table         │
│ Execute: Policies (RLS)      │
└──────────────────────────────┘
           ↓
STEP 5: Test Connection
┌──────────────────────────────┐
│ Terminal: npm run dev        │
│ Browser: localhost:8080      │
│ Try: Sign up                 │
│ Check: Supabase > Auth Users │
│ Try: Scan URL                │
│ Check: Supabase > scans table│
└──────────────────────────────┘
           ↓
        ✅ SUCCESS!
```

## 🗂️ Documentation Guide

**Choose Your Path:**

```
IF YOU JUST WANT IT TO WORK:
└─ SUPABASE_QUICK_START.md ............ 5 minutes

IF YOU WANT DETAILED INSTRUCTIONS:
└─ SUPABASE_SETUP.md ................. 15 minutes

IF YOU WANT TO UNDERSTAND THE CODE:
└─ SUPABASE_UTILITIES.md ............. Reference

IF YOU WANT TO VERIFY EVERYTHING:
└─ SETUP_CHECKLIST.md ................ Validation

IF YOU WANT THE BIG PICTURE:
└─ SUPABASE_README.md ................ Overview (you are here!)
```

## 🔑 The 4 Essential Credentials

```
FROM SUPABASE DASHBOARD:
━━━━━━━━━━━━━━━━━━━━━━━━━

Project Settings > API
│
├─ 1. Project URL
│  └─ https://your-project-id.supabase.co
│     └─ GOES IN: VITE_SUPABASE_URL
│
├─ 2. Anon Public Key
│  └─ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
│     └─ GOES IN: VITE_SUPABASE_PUBLISHABLE_KEY
│
├─ 3. Service Role Key ⚠️
│  └─ NEVER USE IN FRONTEND CODE
│     └─ Only for backend/server operations
│
└─ 4. JWT Secret
   └─ For custom verification if needed

RESULT IN YOUR .env.local:
━━━━━━━━━━━━━━━━━━━━━━━━━

VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1Ni...
```

## 🏗️ Database Architecture

```
SUPABASE INSTANCE
│
├─ AUTHENTICATION
│  └─ auth.users
│     ├─ id (UUID)
│     ├─ email
│     ├─ password (hashed)
│     └─ created_at
│
└─ PUBLIC SCHEMA
   │
   ├─ TABLE: users
   │  ├─ id (PK, references auth.users)
   │  ├─ email
   │  └─ created_at
   │
   └─ TABLE: scans
      ├─ id (PK)
      ├─ user_id (FK → users.id)
      ├─ url (TEXT)
      ├─ result (safe|phishing|suspicious)
      ├─ risk_score (INTEGER 0-100)
      ├─ analysis_details (JSON)
      └─ created_at (TIMESTAMP)
```

## 🔐 Row Level Security (RLS)

```
WITHOUT RLS:
┌─────────┬────────────────────────┐
│ User ID │ URL                    │
├─────────┼────────────────────────┤
│ user-1  │ https://example.com    │
│ user-2  │ https://example.com    │ ← User 1 can see this!
│ user-3  │ https://malicious.com  │ ← User 1 can see this!
└─────────┴────────────────────────┘

WITH RLS:
┌─────────┬────────────────────────┐
│ User ID │ URL                    │
├─────────┼────────────────────────┤
│ user-1  │ https://example.com    │ ← User 1 can see
│ user-2  │ https://example.com    │ ← User 1 CANNOT see
│ user-3  │ https://malicious.com  │ ← User 1 CANNOT see
└─────────┴────────────────────────┘
```

## 📱 Common Operations Flowchart

```
USER SIGNS UP
    ↓
useAuth() → signUp(email, password)
    ↓
Supabase creates auth.users row
    ↓
User added to users table
    ↓
Auth token stored in localStorage
    ↓
User logged in automatically

┌───────────────────────────────────────────┐

USER SCANS URL
    ↓
PhishingScanner component
    ↓
Analyzes URL (your logic)
    ↓
saveScan(userId, url, result, score)
    ↓
INSERT into scans table
    ↓
Display result to user
    ↓
Update scan history

┌───────────────────────────────────────────┐

USER VIEWS HISTORY
    ↓
getUserScans(userId)
    ↓
SELECT * FROM scans WHERE user_id = current
    ↓
RLS ensures only their data
    ↓
Display in ScanHistory component
```

## ⏱️ Time Estimates

| Task | Time | Difficulty |
|------|------|-----------|
| Read this guide | 5 min | ⭐ |
| Create Supabase project | 2 min | ⭐ |
| Get credentials | 1 min | ⭐ |
| Update .env.local | 2 min | ⭐ |
| Create database tables | 5 min | ⭐ |
| Test connection | 5 min | ⭐⭐ |
| Integrate into app | 15-30 min | ⭐⭐ |
| **Total** | **~45 min** | **Easy** |

## ✅ Verification Checklist

Quick check that everything works:

```
1. Sign up successful?
   → Check Supabase > Authentication > Users

2. Can see user's data only?
   → Try same scan in different user account

3. Scan saved to database?
   → Check Supabase > Editor > scans table

4. Statistics correct?
   → Manual count should match displayed stats

5. No errors in console?
   → Open DevTools > Console tab

6. Performance acceptable?
   → Page loads within 2-3 seconds
```

## 🚀 Success = When...

✅ Users can sign up  
✅ Users can sign in  
✅ Users can scan URLs  
✅ Results appear in history  
✅ Statistics are accurate  
✅ Only user's data is visible  
✅ No console errors  
✅ No CORS warnings  

## 📚 Next Actions

```
1. READ:   SUPABASE_QUICK_START.md
2. SETUP:  Create Supabase project
3. PASTE:  Credentials into .env.local
4. CREATE: Database tables (SQL)
5. TEST:   npm run dev
6. BUILD:  Integrate into your app
7. DEPLOY: To your hosting platform
```

## 🎓 Key Takeaways

- **Supabase** = Backend (Database + Auth + Real-time)
- **Your App** = Frontend (React + UI)
- **Connection** = Via `.env.local` credentials
- **Security** = RLS policies + Anon key only
- **Data Flow** = Frontend → Supabase → Database

---

**Ready?** 👉 Open `SUPABASE_QUICK_START.md` and follow the 3-step guide!

**Questions?** 👉 Check `SETUP_CHECKLIST.md` for troubleshooting

**Reference?** 👉 Check `SUPABASE_UTILITIES.md` for all functions
