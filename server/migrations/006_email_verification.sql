-- 006_email_verification.sql
-- Email verification tokens + backfill existing users as verified.

create table if not exists email_verification_tokens (
  id bigserial primary key,
  user_id uuid not null references users(id) on delete cascade,
  token_hash text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists email_verification_tokens_user_idx on email_verification_tokens(user_id);
create index if not exists email_verification_tokens_hash_idx on email_verification_tokens(token_hash);
create index if not exists email_verification_tokens_expires_idx on email_verification_tokens(expires_at);

alter table email_verification_tokens enable row level security;
do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'email_verification_tokens' and policyname = 'email_verification_tokens_owner'
  ) then
    create policy email_verification_tokens_owner on email_verification_tokens
      for all using (user_id = current_app_user()) with check (user_id = current_app_user());
  end if;
end $$;

-- Safe migration: preserve existing users by marking them verified.
update users set email_verified_at = coalesce(email_verified_at, created_at)
where email_verified_at is null;
