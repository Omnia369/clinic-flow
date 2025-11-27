# Changelog

## [Unreleased]

## Added
- Added DB helpers for webhook persistence (SQLite) at `lib/db/client.ts` and `lib/db/webhooks.ts`.
- Added read-only Admin Test Hooks list API at `pages/api/admin/testhooks/list.ts` and UI at `pages/admin/testhooks.tsx`.
- Added admin endpoint for replaying webhooks at `pages/api/admin/testhooks/replay.ts`.
- Added admin page for creating Wise payouts at `pages/admin/wise-payout.tsx`.
