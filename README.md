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

## Notable Endpoints (scaffold)
- GET /api/health — basic health check
- POST /api/preview/command — stubbed preview generator (returns watermarked blocks)
- POST /api/webhooks/paddle — verifies Paddle Classic webhooks via p_signature (RSA-SHA1). 200 if verified; 202 if missing key or unverifiable.
- POST /api/webhooks/paypal — verifies PayPal webhooks via Verify Webhook Signature API. 200 if verified; 202 otherwise.
- GET /api/admin/testhooks — returns captured webhook events (in-memory for local QA)

## Admin surfaces
- /admin — entry point
- /admin/testhooks — QA surface to view captured events (refresh after sending tests)

Note: Captured events are held in-memory for local development only and will reset on server restart. For production, wire a database and replace lib/capture.ts with persistent storage.

## Structure (high level)
- app/ — Next.js App Router pages and API routes
- app/admin — admin surfaces (keys manager, test hooks UI; in progress)
- app/api — server endpoints

## Roadmap (short-term)
1. Admin keys manager and gated preview (1 free per email)
2. Wise and Solana modules (sandbox first)
3. Toolkit content library and preview wiring
4. Analytics hooks (GA4 + Mixpanel via env)

## License
TBD.
