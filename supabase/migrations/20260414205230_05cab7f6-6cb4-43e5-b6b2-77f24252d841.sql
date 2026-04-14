
-- Submissions table
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  city TEXT,
  phone TEXT NOT NULL,
  experience TEXT,
  looking_for TEXT,
  lifestyle TEXT,
  about TEXT,
  status TEXT NOT NULL DEFAULT 'Новая'
);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Only authenticated admin can read submissions
CREATE POLICY "Authenticated users can read submissions"
  ON public.submissions FOR SELECT TO authenticated USING (true);

-- Anyone can insert a submission (public form)
CREATE POLICY "Anyone can insert submissions"
  ON public.submissions FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Authenticated users can update submissions (status change)
CREATE POLICY "Authenticated users can update submissions"
  ON public.submissions FOR UPDATE TO authenticated USING (true);

-- Site content table for editable texts
CREATE TABLE public.site_content (
  id TEXT PRIMARY KEY,
  section TEXT NOT NULL,
  content TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site content"
  ON public.site_content FOR SELECT USING (true);

CREATE POLICY "Authenticated users can update site content"
  ON public.site_content FOR UPDATE TO authenticated USING (true);

-- Puppies table for admin management
CREATE TABLE public.puppies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'available',
  trait TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.puppies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read puppies"
  ON public.puppies FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert puppies"
  ON public.puppies FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update puppies"
  ON public.puppies FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete puppies"
  ON public.puppies FOR DELETE TO authenticated USING (true);

-- Storage bucket for puppy/site photos
INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true);

CREATE POLICY "Anyone can view photos"
  ON storage.objects FOR SELECT USING (bucket_id = 'photos');

CREATE POLICY "Authenticated users can upload photos"
  ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Authenticated users can update photos"
  ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'photos');

CREATE POLICY "Authenticated users can delete photos"
  ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'photos');

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_puppies_updated_at
  BEFORE UPDATE ON public.puppies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
