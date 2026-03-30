# Fix "Failed to Fetch" Error - CORS Configuration

Your Supabase project needs to be configured to allow requests from your development server.

## Current Dev Server URL
Your dev server is running on: **http://localhost:8081** (or http://127.0.0.1:8081)

## Steps to Fix

### 1. Go to Supabase Dashboard
- Visit: https://app.supabase.com
- Select your project: **utmghpygemabnpgvevwt**

### 2. Configure CORS
Navigate to: **Project Settings** > **API**

Look for the section: **"Authorized redirect URLs"** or **"CORS settings"**

### 3. Add Localhost URLs to Authorized List
Add these URLs (copy-paste exactly):
```
http://localhost:8081
http://localhost:8081/
http://127.0.0.1:8081
http://192.168.56.1:8081
http://192.168.1.5:8081
```

### 4. Save Changes
Click **Save** or **Update**

### 5. Verify Configuration
Also ensure under **Project Settings** > **API**:
- Your **Anon Public** key is correct (check .env.local)
- Email provider is enabled in **Authentication**

## Testing After Configuration

1. **Refresh the browser** (Ctrl+R or hard refresh: Ctrl+Shift+R)
2. **Open Developer Tools** (F12)
3. **Go to Console tab**
4. **Try signing up/in** and watch the console

### Expected Console Messages:
✓ `✓ Supabase credentials loaded from .env.local`
✓ `✓ Project URL: https://utmghpygemabnpgvevwt.supabase.co`
✓ `🔐 Attempting sign up with email: ...`
✓ `✓ Sign up successful for: ...`

### If You See Errors:
```
❌ Sign up error: {...}
❌ Network error: fetch failed
❌ CORS error: blocked by CORS policy
```

The console will show the exact error. Copy it and use for debugging.

## Common Issues & Solutions

### Issue: "Failed to fetch"
**Cause**: CORS not configured or network connectivity issue
**Solution**: 
1. Add `http://localhost:8081` to authorized URLs in Supabase
2. Do a hard refresh (Ctrl+Shift+R)
3. Check browser console for exact error

### Issue: "Invalid API key"
**Cause**: Wrong credentials in .env.local
**Solution**: 
1. Open `.env.local` in your project
2. Verify the URL matches: `https://utmghpygemabnpgvevwt.supabase.co`
3. Verify the key is the **Anon Public** key (not Service Role)

### Issue: "Email already registered"
**Cause**: Account already exists
**Solution**: 
1. Try signing in instead
2. Or use a different email address

### Issue: "Email provider not configured"
**Cause**: Auth provider issue
**Solution**:
1. Go to **Supabase Dashboard** > **Authentication** > **Providers**
2. Ensure **Email** provider is enabled
3. Check "Confirm email" settings

## Your Supabase Project Details

- **Project ID**: `utmghpygemabnpgvevwt`
- **Project URL**: `https://utmghpygemabnpgvevwt.supabase.co`
- **Dev Server**: `http://localhost:8081` (current)
- **API Key**: Configured in `.env.local`

## Quick Checklist Before Testing

- [ ] Supabase project created and initialized
- [ ] `.env.local` file has correct credentials
- [ ] `http://localhost:8081` added to Authorized Redirect URLs
- [ ] Email provider enabled in Authentication
- [ ] Browser hard-refreshed (Ctrl+Shift+R)
- [ ] Developer console open (F12)

## Getting Help

If it still doesn't work:

1. **Check console error message** (F12 > Console)
2. **Copy the exact error text**
3. **Check if CORS headers are present**:
   - Open DevTools > Network tab
   - Try to sign up
   - Click the failed request
   - Go to "Response Headers"
   - Look for `access-control-allow-origin`

The error message will tell you exactly what's wrong!

