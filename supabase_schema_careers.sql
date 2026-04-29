-- Create job_roles table
CREATE TABLE IF NOT EXISTS public.job_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL, -- 'Full-time', 'Part-time', 'Internship'
    description TEXT NOT NULL,
    requirements TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create job_applications table
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID REFERENCES public.job_roles(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    resume_url TEXT,
    portfolio_url TEXT,
    cover_letter TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'accepted', 'rejected')),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE public.job_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Policies for job_roles
CREATE POLICY "Allow public read access for active job_roles" 
ON public.job_roles FOR SELECT 
USING (is_active = true);

CREATE POLICY "Allow admin full access to job_roles" 
ON public.job_roles FOR ALL 
USING (true) WITH CHECK (true);

-- Policies for job_applications
CREATE POLICY "Allow public to insert job_applications" 
ON public.job_applications FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow admin full access to job_applications" 
ON public.job_applications FOR ALL 
USING (true) WITH CHECK (true);

-- Insert sample job roles
INSERT INTO public.job_roles (title, department, location, type, description, requirements) VALUES
('Frontend Developer Intern', 'Engineering', 'Remote / Bangalore', 'Internship', 'We are looking for a passionate Frontend Developer Intern to join our team and help build amazing user experiences.', ARRAY['Proficiency in React and TypeScript', 'Understanding of Tailwind CSS', 'Basic knowledge of state management']),
('Full Stack Developer', 'Engineering', 'Bangalore', 'Full-time', 'Seeking an experienced Full Stack Developer to lead our core product development.', ARRAY['5+ years of experience with Node.js and React', 'Experience with Supabase or PostgreSQL', 'Strong system design skills']);
