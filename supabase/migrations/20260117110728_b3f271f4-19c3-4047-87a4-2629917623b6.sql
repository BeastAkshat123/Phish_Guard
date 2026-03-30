-- Create scan_history table for phishing detection records
CREATE TABLE public.scan_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  input_text TEXT NOT NULL,
  input_type TEXT NOT NULL CHECK (input_type IN ('url', 'email')),
  result TEXT NOT NULL CHECK (result IN ('safe', 'phishing', 'suspicious')),
  confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  risk_factors JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;

-- Allow public read/insert for demo purposes (no auth required for B.Tech project demo)
CREATE POLICY "Anyone can view scan history" 
ON public.scan_history 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create scan records" 
ON public.scan_history 
FOR INSERT 
WITH CHECK (true);

-- Add index for faster queries on created_at
CREATE INDEX idx_scan_history_created_at ON public.scan_history(created_at DESC);