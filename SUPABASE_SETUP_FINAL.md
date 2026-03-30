# 🎯 Phishing Guard - Supabase Direct Connection Setup

## ✅ What's Already Done

Your project is **already configured** for Supabase:

1. ✅ **Environment variables** set in `.env.local`
   - Supabase URL configured
   - Public API key configured

2. ✅ **Supabase client** initialized in `src/integrations/supabase/client.ts`
   - Auto-loads from `.env.local`
   - Has proper error handling
   - Logs connection status to console

3. ✅ **Authentication** set up in `src/hooks/useAuth.tsx`
   - Sign up functionality
   - Sign in functionality
   - Session management
   - Auth state listener

4. ✅ **Dependencies installed**
   - @supabase/supabase-js v2.90.1
   - All React UI libraries
   - All development tools

## 🚀 What You Need to Do Now

### STEP 1: Set Up Database Tables (5 minutes)

1. **Open Supabase Dashboard:**
   - Go to https://app.supabase.com
   - Sign in with your account

2. **Access Your Project:**
   - Find and open project: `hgbzoqojgjpbfsngviyd`

3. **Go to SQL Editor:**
   - Click "SQL Editor" in left sidebar
   - Click "New Query"

4. **Copy & Paste SQL:**
   - Open file: `SUPABASE_SQL_SETUP.sql`
   - Copy all content
   - Paste into Supabase SQL Editor
   - Click "Run" button

5. **Verify Success:**
   - You should see 3 green checkmarks ✓
   - Table "scan_history" will be created
   - RLS policies will be applied
   - Indexes will be created

### STEP 2: Test the Connection (2 minutes)

1. **Start Dev Server:**
   ```bash
   npm run dev
   ```

2. **Open Browser:**
   - Go to http://localhost:5173
   - Open DevTools (F12)
   - Go to "Console" tab

3. **Check for Green Messages:**
   ```
   ✓ Supabase credentials loaded from .env.local
   ✓ Project URL: https://utnghpygemabnpgvevwt.supabase.co
   ```

4. **Create Test Account:**
   - Click "Sign Up" button
   - Use any email + password
   - Should log in automatically

5. **Run a Test Scan:**
   - Go to "Detect" page
   - Enter a URL: `https://example.com`
   - Click "CHECK SAFETY"
   - Watch console for: `Saving scan for user: [id]`
   - Watch console for: `Scan saved successfully`

### STEP 3: Verify Database (1 minute)

1. **Check Supabase Dashboard:**
   - Go back to https://app.supabase.com
   - Open your project
   - Click "Table Editor"
   - Select "scan_history" table
   - You should see your scans!

2. **Check Your History:**
   - Go to Detect page in app
   - Scroll down to "Your Scan History"
   - Your scans should appear in a table

## 📊 Current Project Structure

```
Phishing Guard
├── src/
│   ├── integrations/supabase/
│   │   └── client.ts          ← Supabase client (configured)
│   ├── hooks/
│   │   └── useAuth.tsx         ← Authentication (configured)
│   ├── components/
│   │   ├── PhishingScanner.tsx ← Saves scans to DB
│   │   └── UserScanHistory.tsx ← Loads scans from DB
│   └── pages/
│       ├── Auth.tsx            ← Login/signup page
│       └── Detect.tsx          ← Main scanning page
├── .env.local                  ← Your Supabase credentials ✓
└── supabase/
    └── config.toml             ← Supabase project config
```

## 🔍 How It Works

### Scan Flow:
1. User enters URL/email in PhishingScanner
2. Component analyzes it locally
3. Result saved to `scan_history` table with user_id
4. UserScanHistory component fetches scans
5. Scans displayed in table on Detect page

### Database Security:
- RLS (Row Level Security) enabled
- Users can ONLY see their own scans
- Users can ONLY insert their own scans
- Users can ONLY delete their own scans
- Automatic enforcement by Supabase

## 🛠️ Troubleshooting

### Problem: Console shows "⚠️ Supabase environment variables are missing!"

**Solution:**
- Restart dev server: Stop with Ctrl+C, then `npm run dev`
- Check `.env.local` file exists and has both variables

### Problem: "Failed to load scan history" error

**Solution:**
- Run the SQL setup from SUPABASE_SQL_SETUP.sql
- Verify RLS policies exist in Supabase
- Check console (F12) for detailed error message

### Problem: Scans not appearing in database

**Solution:**
- Check console for "Database insert error"
- Verify user is authenticated (not signed out)
- Make sure user_id is being passed correctly
- Check that RLS policy allows INSERT

### Problem: Can see other people's scans

**Solution:**
- RLS policies might not be applied correctly
- Re-run the SQL setup
- Check in Supabase that policies exist

## ✨ Verification Checklist

After setup, verify each of these:

- [ ] Supabase project is active
- [ ] SQL setup completed without errors
- [ ] Dev server starts with no errors
- [ ] Console shows green ✓ messages
- [ ] Can sign up for new account
- [ ] Can log in with created account
- [ ] Can run a scan
- [ ] Console shows "Scan saved successfully"
- [ ] Scan appears in database (Table Editor)
- [ ] Scan appears in app history
- [ ] Can delete a scan
- [ ] Can only see your own scans
- [ ] Other user can't see your scans

## 📚 Additional Resources

- **Supabase Docs:** https://supabase.com/docs
- **SQL Setup File:** `SUPABASE_SQL_SETUP.sql`
- **Connection Guide:** `SUPABASE_CONNECTION_GUIDE.md`
- **Quick Checklist:** `SUPABASE_QUICK_CONNECT.md`

## 🎉 Next Steps

After verifying everything works:

1. Test with multiple accounts
2. Try the History page navigation
3. Test sign out / sign in
4. Verify session persistence
5. Deploy to production when ready

---

**Need Help?**
- Check the browser Console (F12) for error messages
- Look in Supabase SQL logs for database errors
- Check that all three green ✓ messages appear on load
