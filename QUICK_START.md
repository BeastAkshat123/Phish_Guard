# ⚡ QUICK START - Supabase Connection

## Your Project Details
- **Project ID:** hgbzoqojgjpbfsngviyd
- **Supabase URL:** https://utnghpygemabnpgvevwt.supabase.co
- **Status:** ✅ Ready to connect

## 3 Simple Steps

### 1️⃣ Set Up Database (5 min)
```
Go to: https://app.supabase.com
→ Open your project
→ SQL Editor
→ New Query
→ Copy content from: SUPABASE_SQL_SETUP.sql
→ Paste & Run
```

### 2️⃣ Start App (1 min)
```bash
npm run dev
```

### 3️⃣ Test (2 min)
```
1. Go to http://localhost:5173
2. Sign up (any email/password)
3. Go to Detect page
4. Scan a URL
5. Check history below
6. Success! ✅
```

## Files to Know

| File | Purpose |
|------|---------|
| `.env.local` | Your Supabase credentials |
| `SUPABASE_SQL_SETUP.sql` | Copy-paste this into Supabase SQL Editor |
| `SUPABASE_SETUP_FINAL.md` | Complete setup guide |
| `src/integrations/supabase/client.ts` | Supabase client (already configured) |

## What Gets Created

✅ `scan_history` table - stores your scans  
✅ RLS policies - security  
✅ Indexes - speed  

## Check Console

Open DevTools (F12 > Console) and look for:
```
✓ Supabase credentials loaded from .env.local
✓ Project URL: https://utnghpygemabnpgvevwt.supabase.co
```

## Test Scan Console Log

After scanning, you should see:
```
Saving scan for user: xxxxx
Scan saved successfully: [...]
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Environment variables missing" | Restart: Ctrl+C then `npm run dev` |
| "Failed to load history" | Run SQL setup in Supabase |
| Scans not saving | Check console for "Database insert error" |
| Can see others' scans | Re-run SQL setup (RLS issue) |

## That's it! 🎉

Everything else is already configured. Just:
1. Run SQL setup
2. Start server
3. Test it

Questions? Check `SUPABASE_SETUP_FINAL.md` for detailed guide.
