# BLACKFRAM — Product Roadmap

Prioritized implementation plan. No code changes made during audit.

## Priority 1 — Critical existing bugs / hardening
1. **Rate limiting** on auth endpoints (register/login/forgot/reset) — brute-force protection.
2. **CSP header** + tighten security headers.
3. **Email verification flow** — column exists (`email_verified_at`); add route + UI + gate publishing.
4. **Resolve README merge conflict markers**.
5. **Remove/consolidate legacy root HTML marketing pages** (or redirect to React app).
6. **Hardcoded Render URL in `web/vercel.json`** — move to env var.

## Priority 2 — Core Linktree parity
7. **Unlimited links** — already unlimited (no cap enforced); verify & document. Add link groups/categories.
8. **Featured/pinned links** — add `is_featured` + UI badge.
9. **Image & video blocks** — new block types in appearance schema (image, video embed, text).
10. **QR code generation** — generate PNG/SVG for public URL; download button.
11. **Email capture / audience** — subscribers table + form block + export.
12. **Custom domains** — domain table, verification (DNS TXT), routing by host.

## Priority 3 — Page customization
13. **More templates** (already 6; add 4+ vibrant options).
14. **Background image upload** — replace URL-only with upload pipeline.
15. **Font picker expansion**, button styles, spacing controls.
16. **Block-based page builder** — drag-and-drop sections (profile, links, products, media, text).

## Priority 4 — Analytics
17. **Device/browser/geo breakdown** (currently only counts + 14d series).
18. **Referrer sources**, UTM tracking.
19. **Per-link/per-product click analytics** with time series.
20. **Export (CSV)** and date range filters.

## Priority 5 — Creator storefront
21. **Digital product file delivery** — upload files, secure download links, expiry.
22. **Payments** — Stripe/Razorpay checkout integration (currently UPI link-out only).
23. **Order management** — orders table, status, fulfillment.
24. **Inventory/stock** for physical products.

## Priority 6 — AI features
25. **AI page generation** — generate profile/bio/links from a prompt (requires LLM API key, server route, UI).
26. **AI copywriting** — improve bio, link titles, product descriptions.
27. **AI creator assistant** — chat panel in dashboard with context (links/products/analytics).
28. **Cost controls** — rate limit AI calls per user/plan, usage tracking.

## Priority 7 — Advanced creator tools
29. **Media kits** — data model (stats, audience, rates, brand deals) + public media kit page.
30. **Link scheduling** — show/hide links by date.
31. **A/B testing** of link order/copy.
32. **Team/collaboration** — multi-user per tenant.

## Per-feature template (example: Rate limiting)
- **User problem**: Auth endpoints vulnerable to brute force.
- **Frontend**: none (transparent).
- **Backend**: add express-rate-limit (or custom) middleware on `/api/auth/*`; config via env.
- **DB**: optional `rate_limit_events` table or in-memory store; Redis for multi-instance.
- **Dependencies**: express-rate-limit (lightweight).
- **Acceptance**: 429 after N failed logins per IP; tests pass.
- **Tests**: integration test for 429 response.

Each roadmap item should follow this template when implemented. Wait for approval before starting.
