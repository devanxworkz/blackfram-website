# BLACKFRAM — Email Authentication Audit & Recommendation

Read-only research and audit. No code, env, DB or deployments changed.

## 1. Industry authentication patterns (general, from public docs)

Established SaaS products (Notion, Canva, Slack, Shopify, HubSpot, Linear, Figma, Stripe) commonly use:
- **Email + password signup** with server-side validation, password hashing (bcrypt/argon2/scrypt), and a **verification email** before full access.
- **Email verification via single-use, expiring link** (most common) — sometimes OTP for 2FA or high-risk actions.
- **Google OAuth** (OIDC) relying on the `email_verified` claim; linking by verified email; account creation only when no match.
- **Password reset** with short-lived (15–60 min), single-use tokens; invalidates existing sessions on success.
- **Sessions**: httpOnly, Secure, SameSite cookies; server-side session store or signed JWT; logout invalidates server-side.
- **Rate limiting** on login/register/reset; account lockout or exponential backoff.
- **No account enumeration**: generic "invalid email or password" / "if an account exists, we sent a link".
- **Email change** requires re-verification of the new address.
- **Admin accounts**: separate role, MFA recommended, no public registration.

## 2. BLACKFRAM current authentication audit

### Registration (server/src/routes/auth.ts, services/account.ts)
- Validates `registerSchema` (email, password min 8, displayName, username).
- `createAccount`: unique username check, scrypt password hash, insert user (unique email_lower), tenant, profile. Rollback on failure.
- Unique email → 409 "An account with that email already exists." (reveals existence).
- No email verification: account is active immediately; `email_verified_at` (migration 005) is never set for password users.
- No verification email sent. No verification token table.

### Login
- `verifyCredentials` (find by email_lower, scrypt verify with timingSafeEqual).
- Suspended check. Creates session, touchLastLogin, sets cookie.
- No email-verification check. No rate limiting. No lockout.

### Google OAuth (services/oauth-google.ts, routes/auth.ts callback)
- `verifyIdToken` with audience = client ID; requires `email_verified`.
- Links by `google_id` or verified email; creates account with random password; sets `email_verified_at`.
- No `state` validation (CSRF gap). No domain restriction.

### Password reset
- forgot-password: always returns `{ ok: true }` (no enumeration). Creates 1-hour single-use hashed token; invalidates previous unused tokens. Sends email via Resend/SMTP. Logs dev URL only in non-prod.
- reset-password: consumes token (single-use, expiry), updates password, deletes all sessions. Good.

### Sessions (services/sessions.ts, http/cookies.ts)
- DB-backed, hashed token, 30-day TTL. httpOnly, Secure (prod), SameSite (lax dev / none prod). No domain attribute. No ID regeneration. Logout deletes session + clears cookie.

### Email (services/email.ts)
- Resend (if configured) or SMTP; returns `{ sent, reason }`. Graceful fallback. No verification template exists.

### Database
- `users.email_verified_at` exists (nullable). No verification token table. RLS on users/tenants/etc.

## 3. Feature comparison table

| Feature | Industry practice | BLACKFRAM current | Missing |
|---|---|---|---|
| Email/password registration | Validated, hashed, verified email | Validated, hashed, no verification | Verification flow |
| Email ownership verification | Single-use expiring link (or OTP) | None (column unused for password users) | Token table, email, endpoint, UI |
| Verification method | Link (common) / OTP (2FA) | None | Primary method |
| Google OAuth | OIDC, verified email claim, safe linking | Implemented, verified claim, linking | State validation |
| Unverified restrictions | Block or limit features | None (full access) | Gate on verification |
| Duplicate email handling | Generic error, no enumeration | 409 reveals existence | Generic response |
| Forgot password | Expiring single-use token, generic response | Implemented correctly | Rate limiting |
| Resend verification | Standard | Not implemented | Endpoint + UI |
| Session management | httpOnly/Secure/SameSite, server-side | Implemented | Domain config, regeneration |
| Account recovery / email change | Re-verify new email | Not implemented | Flow + table |
| Rate limiting | On auth endpoints | None | Middleware |
| Account lockout | Optional | None | Optional |
| MFA/2FA | Optional | None | Optional |
| Admin protection | Role + MFA | Role only | MFA (optional) |

## 4. Security gaps
1. No email verification → unverified/typo emails can own accounts; password reset can be hijacked if email unverified.
2. No rate limiting on login/register/reset → brute force.
3. Register returns 409 on duplicate email → account enumeration.
4. OAuth `state` not validated → CSRF on OAuth linking.
5. No email change verification flow.
6. No session listing/revocation UI.
7. Admin has no MFA (optional but recommended).
8. `email_verified_at` never populated for password users.

## 5. Recommended final architecture

Adopt the proposed flow (it matches industry practice):
- New user: create unverified account → send verification email (single-use link, 24h expiry) → user clicks → account verified → dashboard access.
- Existing user: login checks password then verification status. If unverified, allow login but redirect to "verify your email" page with resend; block publishing/public page until verified (or block dashboard entirely — recommend blocking dashboard with resend option).
- Google login: validate `email_verified`, link/create, set `email_verified_at`, issue session. No verification email needed (Google already verified).
- Account recovery: existing forgot/reset password (good), add rate limiting.

**Verification method recommendation: Email verification link (primary).**
- Security: high (single-use, expiring, server-side token hash).
- UX: low friction (one click).
- Complexity: moderate (token table, email template, endpoint, UI).
- Email dependency: same as password reset (already integrated).
- Cost: low (Resend already configured).
- Suitability: best for BLACKFRAM.

OTP (6-digit) is better for 2FA / high-risk actions, not initial verification. Magic link can replace password login optionally (future). Google OAuth is the lowest-friction path and already trusted.

## 6. Exact registration/login journeys (recommended)

**New user (email):**
1. POST /api/auth/register → create unverified user + tenant + profile; create session? Recommend: create account but do NOT issue full session until verified; OR issue session but restrict dashboard. Industry common: issue session but gate features. Simpler for BLACKFRAM: create account, send verification email, return `{ ok: true, needsVerification: true }`, no session. User redirected to "Check your email" page.
2. User clicks link → GET /api/auth/verify-email?token=... → validate single-use hashed token, set email_verified_at, invalidate token → redirect to login (or auto-login).
3. User logs in → verified → dashboard.

**Existing user (email):**
1. POST /api/auth/login → verifyCredentials. If not found → generic 401.
2. If suspended → 403.
3. If not verified → return 403 with code `email_not_verified` (or allow login with restricted flag). Recommend: allow login but frontend redirects to verification-pending page with resend. Simpler: block dashboard, show resend.
4. Verified → session + cookie → dashboard.

**Google login:**
1. Frontend → /api/auth/google/url → redirect to Google.
2. Callback → verify code + email_verified claim → find/link/create user (set email_verified_at) → session → redirect to dashboard. (Already implemented; add state validation.)

**Account recovery:** existing flow (good). Add rate limiting.

## 7. Database changes required (additive only)
- New table `email_verification_tokens (id bigserial pk, user_id uuid fk cascade, token_hash text, expires_at timestamptz, used_at timestamptz, created_at)` with indexes on user_id, token_hash, expires_at.
- Use existing `users.email_verified_at` (already in schema).
- Migration: mark all existing users `email_verified_at = COALESCE(email_verified_at, created_at)` so no one is locked out.
- RLS: enable on new table (owner policy) or service-role access.

## 8. Backend changes required
- `POST /api/auth/verify-email` (or GET with token) — validate single-use hashed token, set email_verified_at, invalidate token.
- `POST /api/auth/resend-verification` (authed or email-based) with rate limiting.
- On register: send verification email via Resend; don't issue full session (or gate).
- On login: check verification status; return appropriate response.
- Rate limiting middleware on auth endpoints (login, register, forgot-password, resend-verification, verify-email).
- Generic duplicate-email response (no enumeration).
- OAuth: validate `state` (store in httpOnly cookie, compare in callback).
- Email change endpoint (optional, future).

## 9. Frontend changes required
- "Check your email" page after registration.
- "Verify email" pending page with resend button.
- Handle `email_not_verified` login response → redirect to pending page.
- Success banner after verification.
- Resend verification button.
- Update AuthProvider to carry verification status (or infer from /me).

## 10. Resend configuration requirements
- Verified domain in Resend (currently using onboarding@resend.dev — works for testing only; production needs verified domain).
- `SMTP_FROM` = `BLACKFRAM <no-reply@yourdomain.com>` with verified domain.
- Templates: verification email, password reset (already), welcome (optional).
- Rate limits: Resend has sending limits; handle `reason` from sendEmail (already returns reason).

## 11. Implementation phases
- **Phase 1 (Critical before launch)**: email verification tokens + endpoint + email + register flow + login gate + migration (mark existing verified) + rate limiting on auth endpoints.
- **Phase 2 (Recommended)**: resend verification UI, verification-pending page, OAuth state validation, generic duplicate-email response.
- **Phase 3 (Optional)**: email change flow, session management UI, MFA, magic link, disposable email filtering (with trade-offs).

## 12. Testing checklist
- Register → verification email sent → click link → account verified → login → dashboard.
- Expired token → error + resend.
- Reused token → error.
- Unverified login → pending page + resend works.
- Google login → verified automatically, no verification email.
- Existing users (marked verified) → login works.
- Rate limit → 429 after N attempts.
- Password reset still works end-to-end.
- Enumeration: duplicate register and forgot-password return generic responses.
- OAuth state mismatch → rejected.

## 13. Risk assessment for existing production users
- Migration marks all existing users as verified → no lockout.
- Google users already have email_verified_at set.
- Password users get marked verified by migration → no disruption.
- New users after deploy must verify before dashboard access → communicate in release notes.
- No passwords or sessions invalidated (except reset-password flow already invalidates sessions; verification flow won't).
- Public pages unaffected (verification gates dashboard, not public page visibility — though consider gating publish on verification).

## Ranking
- **Critical before launch**: email verification flow, rate limiting, OAuth state validation, generic duplicate-email response, production Resend domain.
- **Recommended**: resend verification UI, verification-pending page, email change flow.
- **Optional**: MFA, magic link, disposable email filtering, session management UI.

No code, env, DB, or deployments were changed. Awaiting your approval before implementing.