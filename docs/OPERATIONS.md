# Clinic Flow — Operations Guide

This guide covers environment setup, webhooks, payouts, Solana Pay, and the admin QA tools. Keep credentials in .env (never commit secrets).

## 1) Environment Variables

Core
- ADMIN_BEARER_TOKEN — required for admin endpoints (/api/admin/*)
- NODE_ENV — 'development' | 'production'

Payments & Webhooks
- PADDLE_PUBLIC_KEY — Paddle Classic vendor public key (PEM)
- PAYPAL_ENV — 'sandbox' | 'live'
- PAYPAL_CLIENT_ID — PayPal REST App client id
- PAYPAL_CLIENT_SECRET — PayPal REST App client secret
- PAYPAL_WEBHOOK_ID — The specific webhook ID you configure in PayPal
- WISE_ENV — 'sandbox' | 'live'
- WISE_API_TOKEN — Wise API token (Bearer)

Solana
- SOLANA_RPC_URL — e.g., https://api.mainnet-beta.solana.com or a provider RPC
- SOLANA_USDC_MINT — default 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' (USDC on Solana mainnet)

Analytics
- GA4_MEASUREMENT_ID — e.g., G-XXXXXXX
- MIXPANEL_TOKEN — project token

## 2) Webhooks

### Paddle Classic (POST form-encoded)
- Endpoint: /api/webhooks/paddle
- Content-Type: application/x-www-form-urlencoded
- Verification: RSA-SHA1 of PHP-serialized fields (exclude p_signature, sort keys, serialize, verify with PADDLE_PUBLIC_KEY). Returns 200 on verified, 202 otherwise.
- Official docs: https://developer.paddle.com/classic/webhook-reference/zg9joji1mzuzotg2-verifying-webhooks

### PayPal (POST JSON)
- Endpoint: /api/webhooks/paypal
- Capture headers: PAYPAL-TRANSMISSION-ID, PAYPAL-TRANSMISSION-TIME, PAYPAL-CERT-URL, PAYPAL-AUTH-ALGO, PAYPAL-TRANSMISSION-SIG
- Verification: POST to /v1/notifications/verify-webhook-signature with OAuth Bearer token; include headers, webhook_id, and raw event.
- Expected: { verification_status: 'SUCCESS' } → 200; otherwise 202.
- Official API Ref: https://docs.paypal.ai/reference/api/rest/verify-webhook-signature/verify-webhook-signature
- Integration guide: https://paypal.ai/docs/accept/webhook-integration

### Capture & QA
- Incoming events are captured for QA (raw body + parsed, headers, verification result).
- Admin UI: /admin/testhooks lists captured events, filters by provider, and supports replay (idempotent).

## 3) Wise Payouts (Admin-only)
Flow (sandbox by default):
1) Get profileId
2) Create quote
3) Create recipient account
4) Create transfer
5) Fund transfer from balance

Primary endpoints (see Wise docs):
- POST /v3/profiles/{profileId}/quotes
- POST /v1/accounts (aka recipients)
- POST /v1/profiles/{profileId}/transfers
- POST /v3/profiles/{profileId}/transfers/{transferId}/payments

Notes
- Auth: Bearer {WISE_API_TOKEN}
- Environments: sandbox api.sandbox.transferwise.tech, live api.transferwise.com
- Webhooks: subscribe to transfers#state-change for async status
- Official docs hub: https://docs.wise.com/ and https://docs.wise.com/api-reference

## 4) Solana Pay (USDC)
Request
- Generate a Solana Pay URL with: recipient=merchant wallet, amount, spl-token=USDC mint, reference (unique Pubkey), label/message/memo optional.
- USDC mint (mainnet): EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v (source: https://developers.circle.com/stablecoins/usdc-contract-addresses)

Verify on-chain
1) Use getSignaturesForAddress(reference) to find a matching signature.
2) Use getTransaction(signature) and check recipient, amount, and mint (SPL Token transfer) match the request.
3) Consider commitment level 'confirmed' or 'finalized' before settling.

Official references
- Solana Pay Spec: https://docs.solanapay.com/spec
- SPL Token Program: https://spl.solana.com/token
- Associated Token Account: https://spl.solana.com/associated-token-account
- getSignaturesForAddress: https://solana.com/docs/rpc/http/getsignaturesforaddress
- getTransaction: https://solana.com/docs/rpc/http/gettransaction

Operational notes
- No native refunds/chargebacks; handle via separate outbound transfer.
- Detect partial/overpayments in validation; surface to admin.

## 5) Admin Screens
- /admin/keys — issue, list, revoke/reactivate access keys (requires ADMIN_BEARER_TOKEN)
- /admin/testhooks — live webhook viewer; replay verified events; filter by provider
- Payments (frontend):
  - Wise Payouts: create/fund a transfer for a test recipient (sandbox)
  - Solana Pay: generate request and verify settlement via reference

## 6) Staging & Deploys
- Preferred: Vercel with GitHub integration. Create a new Vercel project from this repo, set environment variables, enable Preview Deploys.
- Health: /api/health returns ok.
- CI (optional): add basic typecheck and build in GitHub Actions.

## 7) Security & Compliance
- Never store PHI. For previews, we hash email for one-free gating.
- Webhook handlers fail-closed on signature/shape mismatch.
- Admin endpoints require ADMIN_BEARER_TOKEN; rotate regularly.

## 8) Troubleshooting
- Paddle 202 responses: usually signature mismatch (public key formatting, payload decoding).
- PayPal verify FAILURE: wrong webhook_id or using live creds in sandbox (or vice versa).
- Wise sandbox: ensure profileId exists in sandbox; balances may be fake/funded by Wise.
- Solana validation: ensure the reference key was included in the payer transaction.
