CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT,
    email TEXT,
    password TEXT, -- Added for demo login
    role TEXT CHECK (role IN ('student', 'admin', 'teacher')),
    program TEXT,
    mentor TEXT,
    avatar_seed TEXT,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create modules table
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    duration TEXT,
    is_published BOOLEAN DEFAULT false,
    order_num INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create module_tasks table
CREATE TABLE IF NOT EXISTS public.module_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create task_submissions table
CREATE TABLE IF NOT EXISTS public.task_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID REFERENCES public.module_tasks(id) ON DELETE CASCADE,
    user_id UUID, -- Removed reference for demo
    submission_url TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Setup Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable public access for profiles" ON public.profiles;
CREATE POLICY "Enable public access for profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable public access for modules" ON public.modules;
CREATE POLICY "Enable public access for modules" ON public.modules FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.module_tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable public access for module_tasks" ON public.module_tasks;
CREATE POLICY "Enable public access for module_tasks" ON public.module_tasks FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.task_submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable public access for task_submissions" ON public.task_submissions;
CREATE POLICY "Enable public access for task_submissions" ON public.task_submissions FOR ALL USING (true) WITH CHECK (true);

-- Insert dummy modules (5 total)
INSERT INTO public.modules (id, title, description, duration, is_published, order_num) 
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Introduction to Program', 'Learn the basics and get familiar with the program structure', '2 weeks', true, 1),
  ('22222222-2222-2222-2222-222222222222', 'Core Concepts', 'Master the fundamental concepts required for the program', '3 weeks', true, 2),
  ('33333333-3333-3333-3333-333333333333', 'Practical Applications', 'Apply your knowledge to real-world scenarios', '4 weeks', true, 3),
  ('44444444-4444-4444-4444-444444444444', 'Advanced Topics', 'Dive deeper into advanced concepts and techniques', '3 weeks', true, 4),
  ('55555555-5555-5555-5555-555555555555', 'Final Project', 'Showcase your skills with a comprehensive final project', '2 weeks', true, 5)
ON CONFLICT (id) DO NOTHING;

-- Insert dummy tasks
INSERT INTO public.module_tasks (id, module_id, title)
VALUES
  ('aaaaa111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Complete orientation quiz'),
  ('aaaaa222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Submit introduction video'),
  ('bbbbb111-1111-1111-1111-222222222222', '22222222-2222-2222-2222-222222222222', 'HTML/CSS fundamentals'),
  ('bbbbb222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'JavaScript basics'),
  ('bbbbb333-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Project submission'),
  ('ccccc111-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'Build a landing page'),
  ('ccccc222-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'Create interactive components'),
  ('ccccc333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'Full project implementation'),
  ('ddddd111-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'State management'),
  ('ddddd222-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'API integration'),
  ('eeeee111-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'Project proposal'),
  ('eeeee222-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'Final submission')
ON CONFLICT (id) DO NOTHING;

-- Note: Because profiles requires auth.users, and we are not forcing you to create auth users yet, 
-- you can manually insert some dummy users into auth.users and profiles if you are familiar with Supabase,
-- OR we can alter the profiles table to NOT reference auth.users for demo purposes:
-- ALTER TABLE public.profiles DROP CONSTRAINT profiles_id_fkey;
