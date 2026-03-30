-- Fix overly permissive RLS policies
-- Drop problematic policies
DROP POLICY IF EXISTS "Service role can insert scans" ON public.scan_history;
DROP POLICY IF EXISTS "Allow public read for stats" ON public.scan_history;

-- Service role bypass RLS by default, so we don't need explicit policy
-- For public stats, we only allow count aggregation via edge function

-- Users can only delete their own scans  
CREATE POLICY "Users can delete their own scans" 
ON public.scan_history 
FOR DELETE 
USING (auth.uid() = user_id);