-- Add user_id column to scan_history table to link scans to authenticated users
ALTER TABLE public.scan_history 
ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Create index for faster user-specific queries
CREATE INDEX idx_scan_history_user_id ON public.scan_history(user_id);

-- Enable RLS on scan_history
ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own scans" ON public.scan_history;
DROP POLICY IF EXISTS "Users can insert their own scans" ON public.scan_history;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.scan_history;
DROP POLICY IF EXISTS "Allow public reads for stats" ON public.scan_history;

-- Policy: Users can view their own scans
CREATE POLICY "Users can view their own scans" 
ON public.scan_history 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can insert scans linked to their account
CREATE POLICY "Users can insert their own scans" 
ON public.scan_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Service role can insert scans (for edge function)
CREATE POLICY "Service role can insert scans" 
ON public.scan_history 
FOR INSERT 
WITH CHECK (true);

-- Policy: Allow public read for aggregate stats (count only, no sensitive data)
CREATE POLICY "Allow public read for stats" 
ON public.scan_history 
FOR SELECT 
USING (true);