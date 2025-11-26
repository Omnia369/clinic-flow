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
- Paddle: set PADDLE_PUBLIC_KEY to verify Classic webhooks.
- PayPal: set PAYPAL_ENV ('sandbox' or 'live'), PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, and PAYPAL_WEBHOOK_ID to enable webhook verification.
- Solana: set SOLANA_RPC_URL (optional; defaults to mainnet RPC).
- Wise: set WISE_API_TOKEN (sandbox by default; set WISE_ENV='live' for production) and WISE_PROFILE_ID when ready.

## Notable Endpoints (scaffold)
- GET /api/health — basic health check
- POST /api/preview/command — stubbed preview generator (returns watermarked blocks)
- POST /api/webhooks/paddle — verifies Paddle Classic webhooks via p_signature (RSA-SHA1). 200 if verified; 202 if missing key or unverifiable.
- POST /api/webhooks/paypal — verifies PayPal webhooks via Verify Webhook Signature API. 200 if verified; 202 otherwise.
- POST /api/solana/verify — looks up transactions by Solana Pay reference key and returns the latest signature if found (verification scaffolding; more checks to come).
- GET /api/admin/testhooks — returns captured webhook events (in-memory for local QA)

## Admin surfaces
- /admin — entry point
- /admin/testhooks — QA surface to view captured events (refresh after sending tests)

Note: Captured events are held in-memory for local development only and will reset on server restart. For production, wire a database and replace lib/capture.ts with persistent storage.

## Libraries
- lib/paddle.ts — Classic webhook signature verification (RSA-SHA1 + php-serialize)
- lib/paypal.ts — Verify Webhook Signature API helper
- lib/wise.ts — Wise helpers (profiles, quotes, recipients, transfers, funding)
- lib/solana.ts — Solana connection and reference-based lookup

## Structure (high level)
- app/ — Next.js App Router pages and API routes
- app/admin — admin surfaces (keys manager, test hooks UI; in progress)
- app/api — server endpoints

## Roadmap (short-term)
1. Admin keys manager and gated preview (1 free per email)
2. Wise and Solana modules (full verification and payouts; sandbox first)
3. Toolkit content library and preview wiring
4. Analytics hooks (GA4 + Mixpanel via env)

## License
TBD.
