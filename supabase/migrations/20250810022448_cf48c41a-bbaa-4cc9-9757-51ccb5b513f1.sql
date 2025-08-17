-- Phase C: Payments + Verifications schema, RLS, triggers, and storage bucket

-- 1) Payments table
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  listing_id uuid,
  amount numeric not null,
  currency text not null default 'usd',
  status text not null default 'pending',
  provider text,
  reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Optional FK to listings for better joins
do $$ begin
  alter table public.payments
  add constraint payments_listing_fk
  foreign key (listing_id) references public.listings(id) on delete set null;
exception when duplicate_object then null; end $$;

alter table public.payments enable row level security;

-- Payments policies
create policy if not exists "Users can view their own payments"
  on public.payments for select
  using (auth.uid() = user_id);

create policy if not exists "Users can create their own payments"
  on public.payments for insert
  with check (auth.uid() = user_id);

create policy if not exists "Users can update their own payments"
  on public.payments for update
  using (auth.uid() = user_id);

-- updated_at trigger
create trigger if not exists update_payments_updated_at
before update on public.payments
for each row execute function public.update_updated_at_column();


-- 2) Verification status and documents
-- Enums
do $$ begin
  create type public.verification_doc_type as enum ('id', 'utility_bill');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.review_status as enum ('pending','approved','rejected');
exception when duplicate_object then null; end $$;

-- verification_status
create table if not exists public.verification_status (
  user_id uuid primary key,
  email_verified boolean not null default false,
  phone_verified boolean not null default false,
  id_verified boolean not null default false,
  utility_bill_verified boolean not null default false,
  trusted_seller boolean not null default false,
  notes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.verification_status enable row level security;

create policy if not exists "Users can view their own verification status"
  on public.verification_status for select
  using (auth.uid() = user_id);

create policy if not exists "Users can insert their own verification status"
  on public.verification_status for insert
  with check (auth.uid() = user_id);

create policy if not exists "Users can update their own verification status"
  on public.verification_status for update
  using (auth.uid() = user_id);

create trigger if not exists update_verification_status_updated_at
before update on public.verification_status
for each row execute function public.update_updated_at_column();

-- verification_documents
create table if not exists public.verification_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  type public.verification_doc_type not null,
  file_path text not null,
  status public.review_status not null default 'pending',
  reviewer_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.verification_documents enable row level security;

create policy if not exists "Users can view their own verification documents"
  on public.verification_documents for select
  using (auth.uid() = user_id);

create policy if not exists "Users can create their own verification documents"
  on public.verification_documents for insert
  with check (auth.uid() = user_id);

create policy if not exists "Users can update their own verification documents"
  on public.verification_documents for update
  using (auth.uid() = user_id);

create policy if not exists "Users can delete their own verification documents"
  on public.verification_documents for delete
  using (auth.uid() = user_id);

create trigger if not exists update_verification_documents_updated_at
before update on public.verification_documents
for each row execute function public.update_updated_at_column();


-- 3) Private storage bucket for verification docs
insert into storage.buckets (id, name, public)
values ('verifications','verifications', false)
on conflict (id) do nothing;

-- Storage policies for bucket 'verifications'
create policy if not exists "Users can view their own verification files"
  on storage.objects for select
  using (bucket_id = 'verifications' and auth.uid()::text = (storage.foldername(name))[1]);

create policy if not exists "Users can upload their own verification files"
  on storage.objects for insert
  with check (bucket_id = 'verifications' and auth.uid()::text = (storage.foldername(name))[1]);

create policy if not exists "Users can update their own verification files"
  on storage.objects for update
  using (bucket_id = 'verifications' and auth.uid()::text = (storage.foldername(name))[1]);

create policy if not exists "Users can delete their own verification files"
  on storage.objects for delete
  using (bucket_id = 'verifications' and auth.uid()::text = (storage.foldername(name))[1]);