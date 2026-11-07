-- 007_contact_submissions.sql
-- Contact form submissions from the public marketing site.

create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  category text not null,
  subject text not null,
  message text not null,
  creator_page_url text,
  status text not null default 'new'
    check (status in ('new', 'read', 'replied', 'closed')),
  email_delivery_status text not null default 'pending'
    check (email_delivery_status in ('pending', 'sent', 'failed', 'skipped')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contact_submissions_created_idx on contact_submissions(created_at desc);
create index if not exists contact_submissions_status_idx on contact_submissions(status);
create index if not exists contact_submissions_email_idx on contact_submissions(email);

alter table contact_submissions enable row level security;
-- No public read. Service-role / admin access only.
do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'contact_submissions' and policyname = 'contact_submissions_admin_read'
  ) then
    create policy contact_submissions_admin_read on contact_submissions
      for select using (current_app_user() is not null);
  end if;
end $$;
