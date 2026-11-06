# BLACKFRAM — Database Plan

## Current schema (authoritative: migrations)
Tables: `users`, `tenants`, `profiles`, `links`, `products`, `sessions`, `page_views`, `admin_audit_log`, `password_reset_tokens`, `_migrations`. Views: `public_pages`, `public_links`, `public_products`. RLS on 7 tables.

## Proposed additions for roadmap features

### Rate limiting / abuse
- Table `rate_limit_buckets (key text pk, count int, window_start timestamptz)` OR use Redis. Prefer Redis for multi-instance; PG fallback acceptable for small scale.

### Email capture / audience
- `subscribers (id uuid pk, tenant_id uuid fk, email text, name text, source text, created_at, unique(tenant_id,email_lower))`
- RLS: owner-only.

### Custom domains
- `custom_domains (id uuid pk, tenant_id uuid fk, domain text unique, status text check in ('pending','verified','failed'), verification_token text, verified_at timestamptz, created_at)`
- RLS: owner-only.

### Digital product delivery
- `product_files (id uuid pk, product_id uuid fk, file_url text, file_name text, size_bytes bigint, created_at)` (storage via S3/R2; URL signed).
- `orders (id uuid pk, tenant_id uuid fk, product_id uuid fk, buyer_email text, amount_paise int, currency text, status text, payment_provider text, payment_ref text, created_at, fulfilled_at)`
- RLS: owner-only for tenant; public insert via service role for checkout.

### Media kits
- `media_kits (id uuid pk, tenant_id uuid unique fk, title text, bio text, audience jsonb, rates jsonb, stats jsonb, is_public boolean, created_at, updated_at)`
- RLS: owner write; public read if is_public.

### AI usage
- `ai_usage (id bigserial pk, user_id uuid fk, feature text, tokens int, cost_cents int, created_at)` for cost control.

### Content blocks (advanced page builder)
- Option A: extend `profiles.appearance` JSONB with a `blocks[]` array (no new table) — simpler, keeps existing model.
- Option B: `page_blocks (id uuid pk, tenant_id fk, type text, position int, config jsonb)` — more flexible, more complex. Recommend A for now.

### Featured links
- Add `links.is_featured boolean default false`.

### Link scheduling
- Add `links.starts_at timestamptz`, `links.ends_at timestamptz`.

### Email verification
- Use existing `users.email_verified_at`; add `email_verification_tokens (user_id, token_hash, expires_at, used_at)`.

## Migration strategy
- Continue numbered files `006_*.sql`, `007_*.sql`, … in `server/migrations/`.
- Each migration wrapped in transaction; tracked in `_migrations`.
- Backfill defaults for existing rows.
- RLS policies added in same migration for new tables.
- Never destructive: additive only; deprecate columns before removal.

## Multi-tenant isolation rules
- Every tenant-scoped table has `tenant_id uuid not null fk tenants(id) on delete cascade`.
- RLS policy `tenant_id = current_app_tenant()` for owner access.
- Public reads only via views filtered to `is_published = true` and active rows.
- Service-role operations (checkout, view tracking) bypass RLS intentionally and must validate tenant existence.

## Indexes to add
- `subscribers(tenant_id, created_at desc)`, `orders(tenant_id, created_at desc)`, `custom_domains(domain)`, `media_kits(tenant_id)`.

## Backup / retention
- Production: managed Postgres automated backups; PITR if available.
- Soft-delete not currently used; consider for orders/subscribers.
