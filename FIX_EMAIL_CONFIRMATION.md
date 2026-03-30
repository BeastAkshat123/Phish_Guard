# Fix "Email Not Confirmed" Error - Supabase Configuration

The error "Email not confirmed" means your Supabase project requires email confirmation before allowing sign-in. 

For development, you should disable this requirement.

## Solution: Disable Email Confirmation

### Step 1: Go to Supabase Dashboard
1. Visit: https://app.supabase.com
2. Select your project: **utmghpygemabnpgvevwt**

### Step 2: Disable Email Confirmation
1. Navigate to: **Authentication** (left sidebar)
2. Click: **Providers** tab
3. Find: **"Email"** provider
4. Look for: **"Confirm email"** option
5. **Toggle it OFF** (disable it)

### Alternative Location (if above doesn't work)
1. Go to: **Authentication** > **Settings** (gear icon)
2. Scroll down to: **"Email settings"**
3. Look for: **"Confirm email"** or **"Email confirmation"**
4. **Toggle OFF** or uncheck

### Step 3: Save Changes
- Click **Save** if prompted
- Changes should apply immediately

### Step 4: Test
1. Hard refresh your browser: **Ctrl+Shift+R**
2. Try signing up with a test email
3. You should now be able to sign in immediately without confirmation

## What This Does

- ✅ Allows users to sign in without confirming email first (good for development)
- ❌ Removes email verification (not recommended for production)

## For Production

When you deploy to production, you should:
1. **Enable email confirmation** again
2. Set up email delivery (SendGrid, AWS SES, etc.)
3. Users will receive confirmation emails

## Quick Reference

| Setting | Development | Production |
|---------|-----------|-----------|
| Confirm email | OFF | ON |
| Email provider | Enabled | Enabled |
| Double opt-in | OFF | ON (optional) |

## If Still Getting Error

**Check:**
1. ✓ Email confirmation is **OFF** in Authentication > Providers > Email
2. ✓ You're signing in with correct email/password
3. ✓ Browser is hard-refreshed (Ctrl+Shift+R)
4. ✓ Clear localStorage: Open DevTools (F12) > Console > `localStorage.clear()` > Enter

## Testing Accounts

After disabling email confirmation, you can test with:
- **Email**: test@example.com
- **Password**: Test@123456
- **Expected**: Sign in works immediately without confirmation

## Screenshots Location

In your Supabase dashboard:
```
Authentication 
├── Providers
│   └── Email (enable this)
│       └── "Confirm email" toggle (turn OFF)
└── Settings
    └── Email settings
        └── Configuration options
```

## Still Need Help?

If you still see the error after disabling email confirmation:

1. **Check browser console** (F12 > Console)
2. **Look for error message** - it will tell you exactly what's wrong
3. **Try signing up again** - use a fresh email address
4. **Wait a few seconds** - sometimes settings take time to apply

The console will show the exact Supabase error, which will help debug further!
