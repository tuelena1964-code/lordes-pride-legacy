-- Create puppy_photos table for multiple photos per puppy
CREATE TABLE public.puppy_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  puppy_id UUID NOT NULL REFERENCES public.puppies(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_cover BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_puppy_photos_puppy_id ON public.puppy_photos(puppy_id);
CREATE INDEX idx_puppy_photos_sort ON public.puppy_photos(puppy_id, sort_order);

ALTER TABLE public.puppy_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read puppy photos"
  ON public.puppy_photos FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert puppy photos"
  ON public.puppy_photos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update puppy photos"
  ON public.puppy_photos FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete puppy photos"
  ON public.puppy_photos FOR DELETE
  TO authenticated
  USING (true);