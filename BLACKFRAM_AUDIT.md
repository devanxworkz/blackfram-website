# BLACKFRAM — Product & Technical Audit

Generated: 2026-11-05 (audit only — no production code modified)

## 1. Repository overview

### Stack
- **Frontend**: React 18 + TypeScript + Vite 5 + Tailwind CSS 3 + react-router-dom 6. No UI/animation libraries added.
- **Backend**: Node.js + Express + TypeScript, Zod validation, cookie-based sessions (httpOnly, SameSite).
- **Database**: PostgreSQL (PGlite embedded for local dev; real Postgres in production). Migrations in `server/migrations/*.sql`.
- **Auth**: Email/password (bcrypt) + Google OAuth (optional). Session tokens hashed, stored in `sessions`.
- **i18n**: en/hi/kn (English complete; hi/kn partial scaffolds).
- **Deployment**: Vercel (frontend, proxies `/api/*` to Render backend) + Render (Node API) + Postgres (Render/Neon/Supabase). See `web/vercel.json`, `DEPLOYMENT.md`.

### Top-level layout
- `web/` — React SPA (Vite).
- `server/` — Express API + migrations + tests.
- `e2e/` — Playwright end-to-end tests (19 tests).
- `server/tests/` — Vitest unit/integration tests (8 files).
- Root static HTML (`index.html`, `about.html`, …) — legacy marketing pages, separate from the React app.

### Key directories
- `web/src/pages/marketing/` — Landing, Features, Pricing, StaticPage (Carnival design).
- `web/src/pages/dashboard/` — Overview, ProfileEditor, LinksManager, ProductsManager, Appearance, PreviewPublish, Account.
- `web/src/pages/admin/` — AdminOverview, AdminUsers, AdminStorefronts, AdminAnalytics, AdminModeration, AdminBilling, AdminAudit, AdminPlanned (placeholder).
- `web/src/pages/auth/` — Login, Register, ForgotPassword, ResetPassword.
- `web/src/components/` — AppShell, AuthLayout, Brand, PublicView, ui, icons, marketing/*.
- `server/src/routes/` — auth, profile, links, products, stats, admin, public.
- `server/src/services/` — account, admin, analytics, links, products, profile, sessions, mappers, password-reset, oauth-google, email.
- `server/src/validation/schemas.ts` — Zod schemas for all inputs.

## 2. Frontend architecture
- Single `BrowserRouter` tree in `App.tsx`. Routes grouped: marketing (MarketingLayout), auth (standalone), dashboard (RequireAuth → AppShell creator), admin (RequireAdmin → AppShell admin), public (`/u/:username` → PublicPage), 404.
- State: `I18nProvider` → `ToastProvider` → `AuthProvider` → `App`.
- `AuthProvider`: on mount calls `GET /api/auth/me`; exposes user/profile/loading/refresh/setProfile/logout.
- API client `web/src/lib/api.ts`: fetch with `credentials: 'include'`, JSON, `ApiError` with field-level details. Base URL from `VITE_API_BASE_URL` (default same origin).
- Types in `web/src/lib/types.ts`.

## 3. Backend architecture
- Express app (`app.ts`): CORS (allowlist), security headers (nosniff, referrer-policy, X-Frame-Options DENY, permissions-policy), JSON body (256kb limit), cookie parser, `attachAuth`, route mounts, 404, SPA fallback (prod), global error handler.
- Route-level `requireAuth` / `requireAdmin`; handlers wrapped with `wrap` to forward async errors.
- Zod validation → 422 `validation_error`; unique violations → 409 `conflict`.
- Sessions: random token, hashed, httpOnly cookie, TTL 30 days, purge on expiry.

## 4. Database (summary)
Tables: `users`, `tenants`, `profiles`, `links`, `products`, `sessions`, `page_views`, `admin_audit_log`, `password_reset_tokens`, `_migrations`. Views: `public_pages`, `public_links`, `public_products` (security_invoker=false). RLS enabled on users/tenants/profiles/links/products/sessions/page_views; not on admin_audit_log/password_reset_tokens. Full detail in `BLACKFRAM_DATABASE_PLAN.md`.

## 5. Feature inventory

### A. Fully implemented and working
- Creator registration/login/logout (email+password, Google OAuth optional).
- Session management, password change, forgot/reset password (email token).
- Creator profile (name, bio, avatar, WhatsApp, UPI id+QR, meta title/description).
- Username claim + validation + reserved words.
- Theme (5 presets + custom accent) + layout (classic/grid/feature).
- Appearance editor: templates (6), fonts, colors, avatar, buttons, products layout, sections, background (solid/gradient/image). Live preview, save, publish.
- Links CRUD: add/edit/hide/delete/reorder (drag via arrows), click tracking.
- Products CRUD: title/description/image/price/destination, reorder, toggle active.
- Public storefront `/u/:username`: profile, social icons (auto-classified), links, products, WhatsApp CTA, UPI pay, "Made with" footer.
- Analytics: owner stats (views, 7d, clicks, counts, 14-day series).
- Public view tracking + link click tracking.
- Admin console: overview, users (search/filter/paginate), user detail, suspend/reactivate, storefronts, platform analytics, moderation queue, billing status, audit log.
- i18n (en complete; hi/kn partial).
- Marketing site: Landing, Features, Pricing, Static pages (Carnival design), favicon, responsive.

### B. Implemented but incomplete
- Email sending: `email.ts` exists; password reset uses it. SMTP_FROM defaults to a dev address. Production email (Resend) requires domain verification.
- Google OAuth: code present but requires env creds; may be disabled.
- Hindi/Kannada translations: partial scaffolds.
- Appearance: background image URL accepted but no upload pipeline (URL only).
- Admin "themes/content/announcements/settings" routes are placeholders (`AdminPlanned`).

### C. UI exists but backend missing
- "Media kit" / "AI assistant" — only marketing copy/placeholder; no implementation.
- Email capture / newsletter blocks — no backend.
- QR code generation — not implemented (UI may reference).
- Custom domains — no backend or DNS handling.
- Featured links / image & video blocks — no dedicated block types in appearance schema.

### D. Backend exists but UI missing
- `stats` endpoint returns 14-day series; dashboard Overview shows it (implemented). OK.
- Admin audit distinct actions endpoint exists; UI uses it.
- (None significant otherwise.)

### E. Completely missing
- AI features (page generation, copywriting, assistant) — no integration, no routes, no UI beyond marketing.
- Creator media kits — no data model or UI.
- Audience management / email capture — no subscribers table.
- Custom domains — no table or verification.
- QR codes — no generation.
- Digital product file delivery / checkout — products are link-outs only; no file storage, no payments processing.
- File upload pipeline — no upload endpoints; images are URLs.
- Rate limiting — none.
- Email verification flow — column exists (`email_verified_at`) but no verification route/UI.

### F. Broken or insecure
- `admin_audit_log`, `password_reset_tokens` have no RLS (acceptable since accessed via service role, but inconsistent).
- No rate limiting on auth endpoints (brute-force risk).
- `attachAuth` swallows errors silently.
- CORS allowlist from `CORS_ORIGINS`; if empty, only same-origin — fine.
- Security headers present but no CSP.
- `users.email_lower` unique; OK. `profiles.username_lower` unique; OK.
- Profile RLS `profiles_public_read` exposes published profiles; OK.
- Potential: `appearance` JSONB accepted with validation but large payloads (256kb body limit).
- `web/vercel.json` hardcodes Render URL (environment-specific).
- README has merge conflict markers (`<<<<<<< HEAD`) — unresolved.
- Root static HTML marketing pages are stale/legacy and diverge from React app.

## 6. Comparison vs Linktree/Beacons
See `BLACKFRAM_ROADMAP.md` for gap analysis. Summary: core link-in-bio loop is solid; missing AI, media kits, audience/email, custom domains, QR, file delivery, payments, advanced blocks, rate limiting.

## 7. Architecture & quality audit
- **Multi-tenant isolation**: RLS + app-level tenant scoping; tests in `isolation.test.ts`, `rls.test.ts` pass.
- **Auth**: cookie sessions, bcrypt, Google OAuth. Password reset tokens hashed, expiry, single-use.
- **Validation**: Zod on all routes; good.
- **Public performance**: single page fetch; no caching/CDN for API; images lazy-loaded.
- **Mobile**: responsive Tailwind; dialogs now portaled (fixed).
- **SEO**: meta title/description from profile; OG tags basic; no sitemap/robots.
- **Error handling**: global handler; friendly fallbacks.
- **Migrations**: numbered, tracked in `_migrations`, idempotent.
- **File uploads**: none (URL only) — security N/A but feature gap.
- **Rate limiting**: none.
- **Env handling**: `.env` files; secrets in server/.env (not committed hopefully).
- **Production compat**: Vercel+Render; SPA fallback; static serving in prod.

## 8. Known issues / tech debt
- README merge conflict markers.
- Legacy root HTML pages.
- Partial i18n.
- Placeholder admin pages.
- Hardcoded Render URL in vercel.json.
- `config.ts` default session cookie name `pehchaan_session` (internal, fine).

## Conclusion
BLACKFRAM has a solid, well-structured core (auth, profiles, links, products, appearance, analytics, admin). To reach Linktree/Beacons parity, the main gaps are AI features, media kits, audience/email capture, custom domains, QR codes, file delivery/payments, advanced content blocks, and production hardening (rate limiting, CSP, email verification). See roadmap.
