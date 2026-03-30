# 🚀 Supabase Connection Checklist

## Quick Setup (5 minutes)

- [ ] **Step 1**: Open [Supabase Dashboard](https://app.supabase.com)
- [ ] **Step 2**: Go to your project (ID: `hgbzoqojgjpbfsngviyd`)
- [ ] **Step 3**: Click "SQL Editor" → "New Query"
- [ ] **Step 4**: Copy-paste the SQL from `SUPABASE_CONNECTION_GUIDE.md`
- [ ] **Step 5**: Click "Run"
- [ ] **Step 6**: Restart your dev server: `npm run dev`
- [ ] **Step 7**: Sign up for a test account
- [ ] **Step 8**: Try a scan and check the database

## What Gets Created

✅ `scan_history` table - stores all phishing detection scans  
✅ RLS policies - ensures users only see their own data  
✅ Indexes - makes queries faster  
✅ Stats table - optional, for analytics

## Test the Connection

### In Your Browser:
1. Go to http://localhost:5173
2. Open DevTools (F12)
3. Go to Console tab
4. Look for green ✓ messages (Supabase credentials loaded)
5. Sign up with an email
6. Run a scan
7. Check console for "Scan saved successfully"

### In Supabase Dashboard:
1. Go to Table Editor
2. Select `scan_history` table
3. You should see your scans appearing

## Troubleshooting

**Issue**: Console shows "⚠️ Supabase environment variables are missing!"  
**Fix**: Restart dev server after editing `.env.local`

**Issue**: "Failed to load scan history" error  
**Fix**: Run the SQL setup commands in Supabase

**Issue**: Scans not saving  
**Fix**: Check console for "Database insert error" messages

## Environment Variables

Your `.env.local` has:
- ✓ VITE_SUPABASE_URL = https://utnghpygemabnpgvevwt.supabase.co
- ✓ VITE_SUPABASE_PUBLISHABLE_KEY = already set

(Never share these values or commit to git)

## Next Steps

After testing:
1. Verify all scans appear in database
2. Check history loads on Detect page
3. Try deleting a scan
4. Sign out and sign back in
5. Verify you only see your own scans

## Need Help?

Check the logs in DevTools Console (F12) for detailed error messages.
