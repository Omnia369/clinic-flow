# Clinic Flow

A Next.js application for chiropractic clinic automation with gated preview system, payment processing, and admin tools.

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and configure your environment variables
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file with:

```bash
# Database
DATABASE_URL="file:./clinic-flow.db"

# Admin Access
ADMIN_ACCESS_KEY="your-secret-key"

# Payment Providers
WISE_API_KEY="your-wise-api-key"
WISE_SANDBOX="true"

SOLANA_NETWORK="devnet"
SOLANA_PAY_MERCHANT_WALLET="your-wallet-address"

# Analytics (optional)
GA4_MEASUREMENT_ID="G-XXXXXXXXXX"
MIXPANEL_TOKEN="your-token"

# Email (optional)
RESEND_API_KEY="your-resend-key"
```

## Key Features

### 🎯 Gated Preview System
- One free preview per email address
- Watermarked outputs until key redemption
- Access key management for paid users

### 💳 Payment Processing
- **Wise**: Admin payouts to recipients
- **Solana Pay**: User-facing QR code payments
- **Paddle Classic**: Webhook verification (live)
- **PayPal**: Signature verification (scaffolded)

### 🛠️ Admin Tools
- **Dashboard**: System metrics and health
- **Webhook Inspector**: Test and replay payment webhooks
- **Key Manager**: Generate and manage access keys
- **Wise Payouts**: Initiate transfers to recipients

### 📚 Content System
- 12 themed toolkit templates
- Markdown-based content management
- Static generation for performance

## API Endpoints

### Public
- `GET /api/health` - Health check
- `POST /api/preview/command` - Gated preview generation
- `GET /api/solana-pay` - Generate payment QR
- `GET /api/solana-pay/verify` - Verify payment

### Admin (Bearer token required)
- `GET /api/admin/stats` - System metrics
- `GET /api/admin/testhooks/list` - List captured webhooks
- `POST /api/admin/testhooks/replay` - Replay webhook
- `POST /api/admin/testhooks/prune` - Clear all webhooks
- `POST /api/admin/wise-payout` - Initiate Wise transfer

## Database Schema

The application uses SQLite with the following tables:

- `access_keys` - Generated access keys
- `preview_usage` - Track free preview usage per email
- `captured_webhooks` - Store incoming webhooks for testing
- `payment_transactions` - Record payment attempts

## Deployment

### Vercel
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Security Headers
The `vercel.json` file includes security headers:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block

## Development

### Project Structure
```
pages/
├── api/                 # API routes
├── admin/              # Admin-only pages
├── pay/                # Payment pages
├── toolkits/           # Content pages
└── index.tsx           # Landing page

components/
├── Layout.tsx          # Shared layout
└── [other components]

lib/
├── db/                 # Database utilities
├── admin_auth.ts       # Admin authentication
└── [other utilities]

content/
└── toolkits/           # Markdown content files
```

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Monitoring

- Health check: `/api/health`
- Admin dashboard: `/admin/dashboard`
- Webhook inspector: `/admin/testhooks`

## Support

For operational details, see [OPERATIONS.md](./OPERATIONS.md).

## License

Private repository - All rights reserved.
