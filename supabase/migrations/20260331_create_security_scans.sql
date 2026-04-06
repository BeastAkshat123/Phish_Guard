-- Create security_scans table for vulnerability check records
CREATE TABLE public.security_scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  target_url TEXT NOT NULL,
  overall_grade TEXT NOT NULL CHECK (overall_grade IN ('A', 'B', 'C', 'D', 'F')),
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  findings JSONB DEFAULT '[]'::jsonb,
  scan_categories JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.security_scans ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own vulnerability scans
CREATE POLICY "Users can view their own security scans"
ON public.security_scans
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own vulnerability scans
CREATE POLICY "Users can insert their own security scans"
ON public.security_scans
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own vulnerability scans
CREATE POLICY "Users can delete their own security scans"
ON public.security_scans
FOR DELETE
USING (auth.uid() = user_id);

-- Create indexes for faster queries
CREATE INDEX idx_security_scans_user_id_created ON public.security_scans(user_id, created_at DESC);
CREATE INDEX idx_security_scans_created_at ON public.security_scans(created_at DESC);
