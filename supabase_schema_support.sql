-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES public.profiles(id),
    receiver_id UUID REFERENCES public.profiles(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    is_read BOOLEAN DEFAULT false
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.profiles(id),
    teacher_id UUID REFERENCES public.profiles(id),
    booking_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create extension_requests table
CREATE TABLE IF NOT EXISTS public.extension_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id),
    current_end_date DATE NOT NULL,
    requested_duration TEXT NOT NULL, -- '1 month', '3 months', etc.
    type TEXT NOT NULL, -- 'free', 'paid'
    reason TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extension_requests ENABLE ROW LEVEL SECURITY;

-- Public policies for demo (Restrict in production)
CREATE POLICY "Enable all for messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for bookings" ON public.bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for extension_requests" ON public.extension_requests FOR ALL USING (true) WITH CHECK (true);
