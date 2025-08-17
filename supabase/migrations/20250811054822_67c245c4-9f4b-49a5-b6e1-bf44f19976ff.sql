
-- 1) Add verification level support
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'verification_level') THEN
    CREATE TYPE public.verification_level AS ENUM ('none','professor_verified','deans_list','honor_roll');
  END IF;
END$$;

ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS verification_level public.verification_level NOT NULL DEFAULT 'none';

-- 2) Add ends_at to support "Ending Soon"
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS ends_at timestamptz NULL;

-- 3) Create listing_events for anonymous metrics
CREATE TABLE IF NOT EXISTS public.listing_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  referral_id uuid NULL REFERENCES public.referrals(id) ON DELETE SET NULL,
  event_type text NOT NULL CHECK (event_type IN ('view','share','buy')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS and allow anonymous inserts (public write-only sink)
ALTER TABLE public.listing_events ENABLE ROW LEVEL SECURITY;

-- No SELECT policy on purpose (public cannot read raw events)
-- Public INSERTs allowed for anonymous telemetry
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'listing_events' AND policyname = 'public can insert events'
  ) THEN
    CREATE POLICY "public can insert events"
      ON public.listing_events
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;
END$$;

-- Indexes for aggregation performance
CREATE INDEX IF NOT EXISTS listing_events_listing_id_idx ON public.listing_events (listing_id);
CREATE INDEX IF NOT EXISTS listing_events_created_at_idx ON public.listing_events (created_at);
CREATE INDEX IF NOT EXISTS listing_events_type_idx ON public.listing_events (event_type);
