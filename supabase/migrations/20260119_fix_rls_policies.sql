-- Fix RLS policies for scan_history table
-- Ensure proper read/write policies

-- Drop existing policies to recreate them cleanly
DROP POLICY IF EXISTS "Users can view their own scans" ON public.scan_history;
DROP POLICY IF EXISTS "Users can insert their own scans" ON public.scan_history;
DROP POLICY IF EXISTS "Users can delete their own scans" ON public.scan_history;

-- Policy: Users can view their own scans
CREATE POLICY "Users can view their own scans" 
ON public.scan_history 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can insert their own scans
CREATE POLICY "Users can insert their own scans" 
ON public.scan_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Users can delete their own scans  
CREATE POLICY "Users can delete their own scans" 
ON public.scan_history 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_scan_history_user_id_created ON public.scan_history(user_id, created_at DESC);
