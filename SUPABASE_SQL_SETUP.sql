-- Phishing Guard - Supabase Database Setup
-- Copy and paste this entire SQL into your Supabase SQL Editor
-- Path: SQL Editor → New Query → Paste below → Run

-- ============================================
-- 1. CREATE SCAN_HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.scan_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL,
  input_type TEXT NOT NULL CHECK (input_type IN ('url', 'email')),
  result TEXT NOT NULL CHECK (result IN ('safe', 'phishing', 'suspicious')),
  confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  risk_factors JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- 2. CREATE INDEXES (for performance)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_scan_history_user_id ON public.scan_history(user_id);
CREATE INDEX IF NOT EXISTS idx_scan_history_created_at ON public.scan_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scan_history_user_created ON public.scan_history(user_id, created_at DESC);

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. CREATE RLS POLICIES
-- ============================================

-- Users can view (SELECT) only their own scans
CREATE POLICY "Users can view their own scans" 
ON public.scan_history 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert only their own scans
CREATE POLICY "Users can insert their own scans" 
ON public.scan_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can delete only their own scans
CREATE POLICY "Users can delete their own scans" 
ON public.scan_history 
FOR DELETE 
USING (auth.uid() = user_id);

-- ============================================
-- 5. VERIFY SETUP (run this to check)
-- ============================================
-- Check table was created
SELECT tablename FROM pg_tables WHERE tablename = 'scan_history';

-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity FROM pg_tables 
WHERE tablename = 'scan_history';

-- Check policies are created
SELECT schemaname, tablename, policyname FROM pg_policies 
WHERE tablename = 'scan_history';
