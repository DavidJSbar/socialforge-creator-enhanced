-- Create reddit_opportunities table for storing market research data
CREATE TABLE IF NOT EXISTS reddit_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reddit_id TEXT NOT NULL,
  subreddit TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  author TEXT,
  score INT DEFAULT 0,
  comments INT DEFAULT 0,
  type TEXT NOT NULL CHECK (type IN ('pain_point', 'solution_request', 'discussion', 'question')),
  keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
  sentiment TEXT CHECK (sentiment IN ('negative', 'neutral', 'positive')),
  engagement_score FLOAT DEFAULT 0,
  url TEXT,
  reddit_created_at BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_reddit_opportunities_user_id ON reddit_opportunities(user_id);
CREATE INDEX IF NOT EXISTS idx_reddit_opportunities_subreddit ON reddit_opportunities(subreddit);
CREATE INDEX IF NOT EXISTS idx_reddit_opportunities_type ON reddit_opportunities(type);
CREATE INDEX IF NOT EXISTS idx_reddit_opportunities_engagement ON reddit_opportunities(engagement_score DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE reddit_opportunities ENABLE ROW LEVEL SECURITY;

-- Create RLS policy to allow users to see only their own opportunities
CREATE POLICY "Users can view their own opportunities" 
  ON reddit_opportunities FOR SELECT 
  USING (auth.uid() = user_id);

-- Create RLS policy to allow users to insert their own opportunities
CREATE POLICY "Users can insert their own opportunities" 
  ON reddit_opportunities FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policy to allow users to update their own opportunities
CREATE POLICY "Users can update their own opportunities" 
  ON reddit_opportunities FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policy to allow users to delete their own opportunities
CREATE POLICY "Users can delete their own opportunities" 
  ON reddit_opportunities FOR DELETE 
  USING (auth.uid() = user_id);