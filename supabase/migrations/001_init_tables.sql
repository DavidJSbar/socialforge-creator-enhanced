-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Create profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique,
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create niches table
create table public.niches (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles not null,
  name text not null,
  description text,
  trending_score integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create content ideas table
create table public.content_ideas (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles not null,
  niche_id uuid references public.niches,
  topic text not null,
  description text,
  platforms text[] default array[]::text[],
  status text default 'draft'::text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create generated content table (CRITICAL: unique_hash for deduplication)
create table public.generated_content (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles not null,
  content_idea_id uuid references public.content_ideas,
  platform text not null,
  title text,
  body text,
  hashtags text[] default array[]::text[],
  image_prompts text[] default array[]::text[],
  unique_hash text not null unique,
  status text default 'draft'::text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create review queue table
create table public.review_queue (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles not null,
  content_id uuid references public.generated_content not null,
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  reviewed_at timestamp with time zone,
  reviewed_by uuid references public.profiles,
  status text default 'pending'::text,
  feedback text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create analytics events table
create table public.analytics_events (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles not null,
  content_id uuid references public.generated_content,
  platform text not null,
  event_type text not null,
  metrics jsonb default '{}'::jsonb,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create monetization streams table
create table public.monetization_streams (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles not null,
  type text not null,
  platform text not null,
  name text not null,
  monthly_revenue decimal(10, 2) default 0::numeric,
  status text default 'active'::text,
  metadata jsonb default '{}'::jsonb,
  start_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS (Row Level Security) policies
alter table public.profiles enable row level security;
alter table public.niches enable row level security;
alter table public.content_ideas enable row level security;
alter table public.generated_content enable row level security;
alter table public.review_queue enable row level security;
alter table public.analytics_events enable row level security;
alter table public.monetization_streams enable row level security;

-- Profile policies
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Content policies (user can only see their own)
create policy "Users can view their own content" on public.content_ideas
  for select using (auth.uid() = user_id);

create policy "Users can insert their own content" on public.content_ideas
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own content" on public.content_ideas
  for update using (auth.uid() = user_id);

-- Generated content policies with deduplication check
create policy "Users can view their own generated content" on public.generated_content
  for select using (auth.uid() = user_id);

create policy "Users can insert generated content" on public.generated_content
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own generated content" on public.generated_content
  for update using (auth.uid() = user_id);

-- Create indexes for performance
create index idx_content_ideas_user on public.content_ideas(user_id);
create index idx_generated_content_user on public.generated_content(user_id);
create index idx_generated_content_hash on public.generated_content(unique_hash);
create index idx_review_queue_user on public.review_queue(user_id);
create index idx_analytics_user on public.analytics_events(user_id);
create index idx_monetization_user on public.monetization_streams(user_id);

-- Create trigger for updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at before update on public.profiles
  for each row execute function update_updated_at_column();

create trigger update_content_ideas_updated_at before update on public.content_ideas
  for each row execute function update_updated_at_column();

create trigger update_generated_content_updated_at before update on public.generated_content
  for each row execute function update_updated_at_column();

create trigger update_monetization_streams_updated_at before update on public.monetization_streams
  for each row execute function update_updated_at_column();
