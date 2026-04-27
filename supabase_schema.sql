-- Create leave_requests table
CREATE TABLE IF NOT EXISTS public.leave_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    type TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days INTEGER NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    applied_on TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    approved_by UUID REFERENCES auth.users(id)
);

-- Create tickets table
CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    subject TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'resolved', 'closed')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create ticket_messages table
CREATE TABLE IF NOT EXISTS public.ticket_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'support')),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    type TEXT NOT NULL CHECK (type IN ('success', 'warning', 'info', 'event', 'system')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Set up Row Level Security (RLS)
-- NOTE: These policies allow public access for development purposes.
-- In production, you should restrict these based on auth.uid()!

ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable public access for leave_requests" ON public.leave_requests FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable public access for tickets" ON public.tickets FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable public access for ticket_messages" ON public.ticket_messages FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable public access for notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);

-- Insert some dummy data for notifications
INSERT INTO public.notifications (type, title, message, is_read) VALUES 
('info', 'Welcome to the platform!', 'Your account has been set up successfully.', false),
('event', 'Upcoming Live Session', 'Live session scheduled for tomorrow.', false);

-- Insert some dummy data for tickets
INSERT INTO public.tickets (subject, category, status, priority) VALUES 
('Unable to access Module 3 content', 'Technical', 'in-progress', 'high'),
('Query about internship extension', 'General', 'open', 'low');

-- Get the ID of the first ticket and insert messages (Run this separately if needed or let it be empty)
