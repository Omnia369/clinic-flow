
## System Monitoring & Admin

### Admin Dashboard
- **URL:** `/admin/dashboard`
- **Access:** Requires Admin Access Key (Bearer Token or Cookie).
- **Features:**
  - Real-time system status (Environment, Database connection).
  - Key metrics: Total Access Keys, Preview Usage, Captured Webhooks, Payment Transactions.
  - Latest activity timestamps.

### Health Check
- **Endpoint:** `/api/health`
- **Method:** `GET`
- **Response:** JSON object with `status: "ok"` and current `timestamp`.
- **Usage:** Use this endpoint for uptime monitoring (e.g., UptimeRobot, Pingdom).

### Webhook Inspector
- **URL:** `/admin/testhooks`
- **Features:**
  - View list of captured webhooks (Paddle, PayPal).
  - Inspect full JSON payloads.
  - **Replay:** Re-send a webhook event to the handler to test processing logic.
  - **Prune:** Delete all captured webhooks (useful for resetting test state).
