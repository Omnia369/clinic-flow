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

Copy .env.example to .env and fill in values as needed. Safe to leave most blank during local dev.

## Notable Endpoints (scaffold)
- GET /api/health — basic health check
- POST /api/preview/command — stubbed preview generator (returns watermarked blocks)
- POST /api/webhooks/paddle — accepts Paddle webhooks (verification TODO)

## Structure (high level)
- app/ — Next.js App Router pages and API routes
- app/admin — admin surfaces (keys manager, test hooks UI; in progress)
- app/api — server endpoints

## Roadmap (short-term)
1. Admin keys manager and gated preview (1 free preview per email)
2. Paddle Classic webhook verification (RSA-SHA1, p_signature)
3. Wise and Solana modules (sandbox first)
4. Toolkit content library and preview wiring
5. Analytics hooks (GA4 + Mixpanel via env)

## License
TBD.
