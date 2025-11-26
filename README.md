# Clinic Flow

Chiropractor-first automation toolkits and a lightweight landing app.

## Getting Started

Prereqs:
- Node.js 18+
- npm or pnpm

Install and run:

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Environment

Copy .env.example to .env and fill in values as needed.

Important:
- Set `ADMIN_BEARER_TOKEN` to a secure random string to protect admin APIs.
- Set `PREVIEW_SALT` to a secure random string for hashing emails.
- Paddle: set `PADDLE_PUBLIC_KEY` to verify Classic webhooks.
- PayPal: set `PAYPAL_ENV`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, and `PAYPAL_WEBHOOK_ID`.
- Solana: set `SOLANA_RPC_URL`.
- Wise: set `WISE_API_TOKEN` and `WISE_PROFILE_ID`.

## Notable Endpoints
- GET /api/health — basic health check
- POST /api/preview/command — stubbed preview generator
- POST /api/webhooks/paddle — verifies Paddle Classic webhooks
- POST /api/webhooks/paypal — verifies PayPal webhooks
- POST /api/solana/verify — looks up Solana Pay transactions by reference
- GET /api/admin/testhooks — returns captured webhook events
- GET, POST /api/admin/keys — list and issue access keys (bearer auth)
- PATCH /api/admin/keys/[key] — update key status (bearer auth)

## Admin surfaces
- /admin — entry point
- /admin/keys — UI to issue and revoke access keys. Requires `ADMIN_BEARER_TOKEN` to be entered in a prompt.
- /admin/testhooks — QA surface to view captured webhook events.

Note: Captured events and keys are held in-memory/local sqlite for development and will reset.

## Libraries
- lib/auth.ts — Key generation, email hashing, DB access for keys/previews.
- lib/paddle.ts — Classic webhook signature verification.
- lib/paypal.ts — Verify Webhook Signature API helper.
- lib/wise.ts — Wise API helpers.
- lib/solana.ts — Solana connection and reference-based lookup.

## Roadmap (short-term)
1. Gated preview (1 free per email) using the new key system.
2. Wise and Solana modules (full verification and payouts).
3. Toolkit content library and preview wiring.
4. Analytics hooks (GA4 + Mixpanel via env).

## License
TBD.
