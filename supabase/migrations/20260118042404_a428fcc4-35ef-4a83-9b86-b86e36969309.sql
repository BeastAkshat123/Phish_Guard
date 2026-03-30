-- Check and remove overly permissive insert policy
DROP POLICY IF EXISTS "Users can insert their own scans" ON public.scan_history;

-- Create proper insert policy with user check OR null for service role inserts
CREATE POLICY "Users can insert their own scans" 
ON public.scan_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);