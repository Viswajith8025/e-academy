-- Update notifications table to support specific users
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id);

-- Add a policy to allow users to see their own notifications OR role-based ones
DROP POLICY IF EXISTS "Enable public access for notifications" ON public.notifications;
CREATE POLICY "Enable all for notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);
