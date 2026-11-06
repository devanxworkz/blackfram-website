# BLACKFRAM — Test Plan

## Existing coverage
- Server: Vitest in `server/tests/` — admin, appearance, auth, helpers, isolation, public, rls, validation (8 files).
- E2E: Playwright in `e2e/` — admin, appearance, happy-path, product-form, product-form-focus, social-icons (19 tests).
- All currently pass.

## Test strategy by layer

### Unit (Vitest)
- Services: account, links, products, profile, analytics, admin, sessions, password-reset, mappers.
- Validation: every Zod schema (valid + invalid + boundary).
- Auth middleware: requireAuth, requireAdmin.
- RLS: tenant isolation queries under `SET ROLE`.

### Integration (Vitest + supertest)
- All API routes: happy path + 401/403/422/404/409.
- Auth flows: register, login, logout, me, change-password, forgot/reset, Google OAuth (mocked).
- Multi-tenant isolation: user A cannot read/write user B's links/products/profile.
- Admin: suspend/reactivate, audit log append, last-admin protection.

### E2E (Playwright)
- Marketing: landing renders, pricing/legal pages, navigation.
- Auth: register, login, logout, password reset.
- Dashboard: add/edit/reorder/hide/delete links & products; appearance save + reload persistence; publish + public page.
- Admin: login, suspend creator, audit entry.
- Public: social icons, product cards, UPI, not-found, responsive wrap.
- New (to add): media kit page, AI assistant panel, email capture, QR download, custom domain flow, file delivery.

### Performance / load
- Public page TTFB under 200ms (cached).
- Lighthouse accessibility/SEO/best-practices ≥ 90.
- Load test: 100 concurrent public page views.

### Security tests
- RLS cross-tenant access attempts.
- XSS in bio/link titles (sanitization).
- CSRF (SameSite cookies).
- Rate limit verification.
- File upload type/size (when added).
- OAuth state validation.

### Manual QA checklist
- Mobile (360px, 390px, 414px) and desktop (1280, 1440).
- Dark mode (if added).
- Reduced motion.
- Keyboard navigation + screen reader (aria).
- Cross-browser: Chrome, Safari, Firefox, Edge.

## Acceptance criteria per priority
Priority 1 (hardening): rate limit 429 test, CSP header test, email verification e2e, README clean.
Priority 2 (core): featured links e2e, QR download test, email capture e2e, custom domain verification test.
Priority 3 (customization): template switch e2e, background image upload test.
Priority 4 (analytics): device breakdown test, export CSV test.
Priority 5 (storefront): checkout test (mocked), file download test, order status test.
Priority 6 (AI): AI generation test (mocked LLM), rate limit test.
Priority 7 (advanced): media kit public page e2e, scheduling test.

## Test data / environments
- E2E uses in-memory PGlite + seed (SEED_ON_BOOT=1). Keep.
- Add fixtures for media kits, orders, subscribers in seed.
- Staging environment mirrors production with masked data.

## CI
- Run `npm run typecheck`, server tests, e2e on every PR.
- Lighthouse on main branch deploy.
