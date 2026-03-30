# Supabase Integration Checklist

Complete this checklist to fully set up Supabase for your Phishing Guard project.

## ✅ Pre-Setup

- [ ] Read `SUPABASE_QUICK_START.md`
- [ ] Have Supabase account ready (or create one at https://supabase.com)

## 🏗️ Supabase Project Setup

- [ ] Create new Supabase project
- [ ] Wait for project initialization (2-5 minutes)
- [ ] Project appears in your Supabase dashboard

## 🔑 Get Credentials

- [ ] Go to Project Settings > API tab
- [ ] Copy **Project URL** 
- [ ] Copy **Anon Public** key (NOT service role key)
- [ ] Have credentials ready to paste

## 📝 Update Environment Variables

- [ ] Open `.env.local` file
- [ ] Paste `VITE_SUPABASE_URL`
- [ ] Paste `VITE_SUPABASE_PUBLISHABLE_KEY`
- [ ] Save file

## 🗄️ Create Database Tables

Open Supabase > SQL Editor and run:

### Users Table
- [ ] Copy SQL from `SUPABASE_SETUP.md` Step 4
- [ ] Paste and execute "Users Table" section
- [ ] Verify table created in Tables list

### Scans Table  
- [ ] Copy SQL from `SUPABASE_SETUP.md` Step 4
- [ ] Paste and execute "Scans Table" section
- [ ] Verify table created in Tables list

## 🔐 Configure Authentication

- [ ] Go to Supabase > Authentication > Providers
- [ ] Verify "Email" provider is enabled
- [ ] (Optional) Enable other providers (Google, GitHub, etc.)
- [ ] Check redirect URLs match your app

## 🧪 Test Locally

- [ ] Run `npm install` (refresh dependencies)
- [ ] Run `npm run dev`
- [ ] Visit `http://localhost:8080`
- [ ] Try signing up with test email
- [ ] Check Supabase > Authentication > Users to verify
- [ ] Try signing in
- [ ] Try signing out
- [ ] Check browser console for no errors

## 💾 Test Database Operations

- [ ] Perform a URL scan (if scan feature is implemented)
- [ ] Check Supabase > Editor > scans table for new row
- [ ] Verify row contains correct data
- [ ] Check "created_at" timestamp is correct
- [ ] Check "user_id" references correct user

## 🔍 Verify Row Level Security (RLS)

- [ ] Go to Supabase > Authentication > Policies
- [ ] Confirm RLS is enabled on all tables
- [ ] Verify policies are set correctly:
  - [ ] Users can only see their own data
  - [ ] Users can insert only their own records

## 📊 Test Statistics Feature (if applicable)

- [ ] Scan multiple URLs
- [ ] View scan history
- [ ] Check statistics display correct counts
- [ ] Verify filtering works (safe/phishing/suspicious)

## 🌐 Test Real-Time Features (if applicable)

- [ ] Open app in two different browser windows
- [ ] Perform scan in one window
- [ ] Verify other window updates automatically (if subscribed)
- [ ] Check console for subscription events

## 📁 Verify Files

Project root should contain:
- [ ] `.env.local` (with your credentials)
- [ ] `.env.example` (template)
- [ ] `SUPABASE_SETUP.md`
- [ ] `SUPABASE_QUICK_START.md`
- [ ] `SUPABASE_UTILITIES.md`
- [ ] `SETUP_COMPLETE.md`

Source code should contain:
- [ ] `src/integrations/supabase/client.ts`
- [ ] `src/integrations/supabase/types.ts`
- [ ] `src/integrations/supabase/queries.ts` (utilities)
- [ ] `src/hooks/useAuth.tsx`
- [ ] `src/components/ProtectedRoute.tsx`

## 🔒 Security Verification

- [ ] `.env.local` is in `.gitignore`
- [ ] No secrets in version control
- [ ] `.env.example` has placeholder values only
- [ ] Using Anon Public key (not service role key)
- [ ] RLS policies are active on all tables

## 📱 Test Different Browsers/Devices

- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari (if available)
- [ ] Works on mobile (if applicable)

## 🚀 Pre-Deployment Checks

- [ ] All tests pass: `npm run test`
- [ ] No lint errors: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] Environment variables ready for production
- [ ] Database backup exists (recommended)

## 🌍 Deployment Preparation

- [ ] Choose hosting platform (Vercel, Netlify, etc.)
- [ ] Add environment variables to hosting platform:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_PUBLISHABLE_KEY`
- [ ] Update authorized redirect URLs in Supabase
- [ ] Test authentication flow on staging/preview deployment

## 📝 Documentation

- [ ] Updated project README.md (already done)
- [ ] Added Supabase setup docs (already done)
- [ ] Team has access to documentation
- [ ] Database schema documented
- [ ] API usage examples provided

## 🎓 Team Knowledge

- [ ] Team members read `SUPABASE_QUICK_START.md`
- [ ] Team understands authentication flow
- [ ] Team knows how to use utility functions
- [ ] Team aware of security practices
- [ ] Team knows how to troubleshoot common issues

## 🐛 Troubleshooting Checklist

If you encounter issues, check:

### Connection Issues
- [ ] `VITE_SUPABASE_URL` is correct
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY` is correct (Anon, not service role)
- [ ] `.env.local` is in project root
- [ ] Development server restarted after `.env.local` change
- [ ] No typos in environment variable names

### Authentication Issues
- [ ] Email provider is enabled in Supabase
- [ ] Email verification is not blocking sign-ups (optional)
- [ ] Check auth.users table in Supabase
- [ ] Check browser console for error messages
- [ ] localStorage enabled in browser

### Database Issues
- [ ] Tables exist in Supabase database
- [ ] Tables have correct column names
- [ ] RLS is enabled on tables
- [ ] RLS policies exist and are correct
- [ ] User IDs in scans table match auth.users.id

### Performance Issues
- [ ] Indexes created on frequently queried columns
- [ ] Large result sets paginated
- [ ] Real-time subscriptions limited to necessary tables
- [ ] Connection pooling enabled (Supabase >= tier 2)

## ✨ Success Indicators

When everything is working:
- ✅ Users can sign up
- ✅ Users can sign in
- ✅ Users can view only their own data
- ✅ Scans are saved to database
- ✅ Scan history loads correctly
- ✅ Statistics display accurately
- ✅ No console errors
- ✅ No CORS errors
- ✅ Page loads within 2-3 seconds

## 📞 Need Help?

Refer to these resources in order:

1. **Local**: Check `SUPABASE_QUICK_START.md`
2. **Project**: Check `SUPABASE_SETUP.md`
3. **Code**: Check `SUPABASE_UTILITIES.md`
4. **Official**: https://supabase.com/docs
5. **Support**: Supabase community or GitHub issues

---

**Once all items are checked, your Supabase integration is complete!** 🎉
