NeuroWealth 💰

AI-Powered DeFi Yield Platform on Stellar

NeuroWealth is an autonomous AI investment agent that automatically manages and grows your crypto assets on the Stellar blockchain. Deposit once, let the AI find the best yield opportunities across Stellar's DeFi ecosystem — and withdraw anytime with no lock-ups.

Overview
Traditional savings accounts offer near-zero interest. Traditional DeFi is too complex for most users. NeuroWealth bridges the gap a simple chat interface web powered by an AI agent that autonomously deploys your funds into the highest-yielding, safest opportunities on Stellar.

Why Stellar?

Transaction fees of fractions of a penny — perfect for frequent AI-driven rebalancing
3–5 second finality — the AI can act on market changes instantly
Native DEX + Soroban smart contracts — composable, programmable yield strategies
Native USDC + XLM — borderless capital movement with no friction
Growing DeFi ecosystem — Blend (lending), Templar (borrowing), RWA protocols

Features
FeatureDescription🤖 AI AgentAutonomous 24/7 yield optimization across Stellar DeFi💬 Natural LanguageChat to deposit, withdraw, and check balances📈 Auto-RebalancingAgent shifts funds to best opportunities automatically🔐 Non-CustodialYour funds live in audited Soroban smart contracts⚡ Instant WithdrawalsNo lock-ups, no penalties, withdraw anytime📱 WhatsApp ReadyFull functionality through WhatsApp chat interface🌍 Global AccessNo geographic restrictions, no bank account required🛡️ Security FirstSoroban contracts with ReentrancyGuard and access controls

How It Works

1. User deposits USDC via web app
   ↓
2. Soroban vault contract receives and records the deposit
   ↓
3. Contract emits a deposit event
   ↓
4. AI agent detects the event and deploys funds to best protocol (e.g. Blend)
   ↓
5. Yield accumulates 24/7 — agent rebalances hourly if better opportunities exist
   ↓
6. User requests withdrawal anytime → agent pulls funds → sends back in seconds
   Three Investment Strategies

Conservative — Stablecoin lending on Blend. Low risk, steady 3–6% APY.
Balanced — Mix of lending + DEX liquidity provision. Medium risk, 6–10% APY.
Growth — Aggressive multi-protocol deployment. Higher risk, 10–15% APY.

Tech Stack
Smart Contracts

Language: Rust (Soroban SDK 21.0.0)
Standard: ERC-4626 inspired vault architecture
Network: Stellar Mainnet / Testnet
Security: OpenZeppelin-equivalent patterns (ReentrancyGuard, Pausable, Access Control)

Backend / AI Agent

Runtime: Node.js or Python
Stellar SDK: @stellar/stellar-sdk
AI: Claude API / OpenAI for natural language intent parsing
Database: PostgreSQL / Supabase for user position tracking
Queue: Bull / Redis for reliable transaction processing

Frontend

Framework: Next.js 15
Blockchain: Stellar SDK + Freighter wallet integration
Styling: Tailwind CSS
Charts: Recharts for portfolio analytics

Integrations

Yield Protocols: Blend Protocol (lending), Stellar DEX (liquidity)
Price Feeds: Stellar anchor price feeds

Project Structure
neurowealth/
├── contracts/ # Soroban smart contracts (Rust)
│ └── vault/
│ ├── Cargo.toml
│ └── src/
│ └── lib.rs # Core vault contract
├── agent/ # AI agent backend
│ ├── index.ts # Agent entry point
│ ├── stellar.ts # Stellar transaction helpers
│ ├── strategies/ # Yield strategy logic
│ │ ├── conservative.ts
│ │ ├── balanced.ts
│ │ └── growth.ts
│ ├── protocols/ # DeFi protocol integrations
│ │ └── blend.ts
│ └── nlp/ # Natural language intent parsing
│ └── parser.ts
├── frontend/ # Next.js web app
│ ├── app/
│ ├── components/
│ └── lib/
├── whatsapp/ # WhatsApp bot handler
│ ├── webhook.ts
│ └── responses.ts
├── scripts/ # Deployment and utility scripts
│ ├── deploy.sh
│ └── initialize.sh
└── README.md

WhatsApp Integration
NeuroWealth is designed to be fully operable through WhatsApp, making it accessible to anyone with a smartphone — no wallet app or browser extension needed.
User Flow

1. User sends "hi" to NeuroWealth WhatsApp number
2. Bot introduces itself and asks for phone number verification (OTP)
3. OTP verified → agent creates a Stellar keypair for this user (custodial)
4. User can now deposit, withdraw, and check balance entirely through chat
5. Funds are secured in the Soroban vault contract under their wallet address
   Setting Up the Webhook
   bash# Your webhook endpoint receives WhatsApp messages
   POST /api/whatsapp/webhook

# Register your webhook URL with Twilio

# ngrok http 3000 ← for local testing

Example Conversation
User: deposit 100 USDC
Agent: Got it! Depositing 100 USDC into your Balanced strategy.
This should take about 5 seconds on Stellar... ✅ Done!
You're now earning ~8.4% APY. I'll optimize automatically.

User: what's my balance?
Agent: 💰 Your NeuroWealth Portfolio
Balance: 100.23 USDC
Earnings today: +$0.23
Current APY: 8.4%
Strategy: Balanced

User: withdraw everything
Agent: Withdrawing 100.23 USDC... ✅ Done!
Funds sent to your wallet. Arrived in 4 seconds.

## Getting Started

### Prerequisites

- **Node.js**: 20.x or higher
- **Yarn**: 1.22.22 (managed via Corepack)

### Package Manager

This project uses **Yarn** as the package manager. The version is specified in `package.json`:

```json
"packageManager": "yarn@1.22.22+sha512.a6b2f7906b721bba3d67d4aff083df04dad64c399707841b7acf00f6b133b7ac24255f2652fa22ae3534329dc6180534e98d17432037ff6fd140556e2bb3137e"
```

**Installation:**

- Install Yarn globally: `npm install -g yarn`
- Or use Corepack (Node.js 16.9+): `corepack enable`

**Common Commands:**

```bash
yarn install          # Install dependencies
yarn dev              # Start development server
yarn build            # Build for production
yarn start            # Start production server
yarn lint             # Run ESLint
yarn typecheck        # Run TypeScript type checking
yarn test             # Run unit tests
yarn analyze          # Run bundle analyzer (ANALYZE=true next build)
yarn qa:visual-baseline  # Capture visual test baselines
```

### Bundle Analysis

To analyze your production bundle:

```bash
ANALYZE=true yarn build
```

Or use the convenience script:

```bash
yarn analyze
```

This generates a bundle analysis report in `.next/analyze/`. The output is git-ignored and intended for local development use only.

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/NeuroWealth/NeuroWealth-Frontend.git
   cd NeuroWealth-Frontend
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   yarn dev
   ```

The app will be available at `http://localhost:3000`

## Environment Variables

### Required Environment Variables

```bash
# Public (embedded in browser bundle)
NEXT_PUBLIC_WEBHOOK_URL=http://localhost:2000
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org

# Demo Seed (for consistent mock data in demos/screenshots)
# Set to any string (e.g., "demo-123") to get deterministic random values
# Leave unset to use normal random behavior
NEXT_PUBLIC_DEMO_SEED=

# Server-only (do not expose)
# NEUROWEALTH_API_BASE_URL=http://localhost:8000
# NEUROWEALTH_PORTFOLIO_PATH=/portfolio/overview
# NEUROWEALTH_TRANSACTIONS_PATH=/transactions
AUTH_SECRET=change-me-in-production
```

### Demo Seed for Consistent Mock Data

When running demos or capturing screenshots, set `NEXT_PUBLIC_DEMO_SEED` to any string value to get deterministic random values from mock services. This ensures consistent data across runs:

```bash
NEXT_PUBLIC_DEMO_SEED=demo-123 yarn dev
```

Without this variable set, mock services use normal random behavior.

### Database Setup

1. Install PostgreSQL (version 12 or higher)
2. Create the database:
   ```bash
   createdb neurowealth
   ```
3. Run migrations:
   ```bash
   psql -d neurowealth -f backend/migrations/001_create_users_table.sql
   psql -d neurowealth -f backend/migrations/002_create_deposits_table.sql
   ```

### Stellar Network Configuration

Network switching for the frontend is controlled via `NEXT_PUBLIC_STELLAR_NETWORK` and `NEXT_PUBLIC_STELLAR_HORIZON_URL`.

See:
- [Networks](docs/networks.md)

## Deposit Detection System

The deposit detection system monitors user Stellar wallet addresses for incoming USDC deposits in real-time using the Horizon streaming API.

### How It Works

1. **Monitoring**: When a user completes onboarding and receives a wallet address, the deposit monitor establishes a streaming connection to Horizon API
2. **Detection**: USDC deposits are detected within 10 seconds of Stellar confirmation
3. **Recording**: Deposits are recorded in PostgreSQL with idempotency (duplicate transactions are ignored)
4. **Notification**: Users receive WhatsApp confirmation messages at two stages:
   - "Deposit Received" - immediately after detection
   - "Funds Deployed" - after AI agent deploys funds to yield strategy
5. **Deployment**: The system emits deployment events for external AI agent handlers

### Key Features

- Real-time streaming with automatic reconnection
- Exponential backoff for connection failures (1s to 60s max)
- Transaction hash-based idempotency
- Atomic database transactions for portfolio updates
- Graceful error handling with user notifications

### Services

- **Deposit Monitor**: Streams payment events from Stellar Horizon
- **Deposit Recorder**: Records deposits in database with idempotency
- **Deployment Coordinator**: Emits deployment events and handles confirmations
- **Deposit Messaging**: Sends WhatsApp notifications for deposit lifecycle events

## Backend API Contract

This section defines the integration contract between the Next.js frontend and the real backend service. Until `NEUROWEALTH_API_BASE_URL` is set, all routes fall back to demo/mock data automatically.

### Architecture

```
Browser
  └─→ Next.js /api/* routes          (internal BFF layer)
          ├─→ Real backend            (when NEUROWEALTH_API_BASE_URL is set)
          └─→ Demo / mock data        (default, no backend required)
```

### Response Envelope

Every response — from both the internal `/api/*` routes and the real backend — must use this envelope:

```jsonc
// Success
{ "success": true, "data": { /* typed payload */ } }

// Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",      // machine-readable, see error codes below
    "message": "Human-readable text",
    "details": {                     // optional: per-field error arrays
      "amount": ["Amount is required"]
    }
  }
}
```

### Auth Expectations

| Direction | Mechanism |
|-----------|-----------|
| Browser → Next.js `/api/*` | httpOnly session cookie (`nw_session`) set at sign-in — no extra header needed |
| Next.js server → real backend | `Authorization: Bearer <NEUROWEALTH_API_AUTH_TOKEN>` on every proxied request |

On the frontend, authenticated requests are made through `apiRequest` (see `src/lib/api-client.ts`). On the server, route handlers should use `createServerApiClient()` from the same module, which injects the bearer token automatically.

**Auth session shape** (`AuthSession` in `src/lib/auth-adapter.ts`):

```ts
{
  user: {
    id: string;
    displayName: string;
    email: string;
    walletAddress?: string;
  };
  token: string;   // opaque bearer token; 7-day expiry in mock
  expiresAt: number; // Unix ms timestamp
}
```

The real backend's `/auth/sign-in` and `/auth/sign-up` endpoints must return this shape inside the standard success envelope so the frontend adapter can swap in without UI changes.

### Endpoints

All paths below are relative to `NEUROWEALTH_API_BASE_URL`. The override env var lets you remap individual paths without code changes.

#### `GET /portfolio/overview` — `NEUROWEALTH_PORTFOLIO_PATH`

Returns the authenticated user's portfolio summary.

**Response `data`:**
```ts
{
  totalBalance: number;      // USDC, 2 dp
  totalYield: number;        // USDC earned all-time
  currentApy: number;        // e.g. 8.4  (percent)
  strategy: "conservative" | "balanced" | "growth";
  lastUpdated: number;       // Unix ms timestamp
  allocations: Array<{
    protocol: string;        // e.g. "Blend", "Stellar DEX"
    amount: number;
    percentage: number;
    apy: number;
  }>;
  source: "api" | "demo";   // echoed back; route sets x-neurowealth-source header
}
```

#### `GET /strategy/preference` — `NEUROWEALTH_STRATEGY_PATH`

Returns the user's current strategy setting.

**Response `data`:**
```ts
{ strategy: "conservative" | "balanced" | "growth" }
```

#### `PUT /strategy/preference` — `NEUROWEALTH_STRATEGY_PATH`

Updates the user's strategy preference.

**Request body:**
```json
{ "strategy": "balanced" }
```

**Response `data`:** same shape as GET above.

#### `POST /transactions` — `NEUROWEALTH_TRANSACTIONS_PATH`

Handles both quote generation and transaction submission via the `intent` field.

**Request body:**
```ts
{
  intent: "quote" | "submit";
  kind: "deposit" | "withdrawal";
  values: {
    amount: string;          // stringified number, e.g. "100.00"
    walletAddress: string;   // Stellar public key (G...)
    walletConnected: boolean;
  };
}
```

**Response `data` — quote:**
```ts
{
  quote: {
    kind: "deposit" | "withdrawal";
    amount: number;
    fee: number;
    estimatedApy?: number;   // deposit only
    netAmount: number;
    expiresAt: number;       // Unix ms; quote valid for ~30 s
  }
}
```

**Response `data` — submit:**
```ts
{
  pending: {
    id: string;
    kind: "deposit" | "withdrawal";
    amount: number;
    status: "pending";
    txHash?: string;         // Stellar transaction hash if immediately available
    timestamp: number;
  }
}
```

#### `GET /transaction-history`

Currently served from mock data only. When wiring up the real backend, the query parameters and paginated response shape are:

**Query params:** `kind`, `status`, `dateFrom`, `dateTo`, `page`, `pageSize` (max 50)

**Response `data`:**
```ts
{
  transactions: Transaction[];
  total: number;
  page: number;
  pageSize: number;
}
```

### Error Codes

| Code | Typical HTTP status | Meaning |
|------|--------------------:|---------|
| `VALIDATION_ERROR` | 400 / 422 | Request body or query params failed validation |
| `UNAUTHORIZED` | 401 | Missing or expired bearer token |
| `FORBIDDEN` | 403 | Token valid but insufficient permissions |
| `NOT_FOUND` | 404 | Resource does not exist |
| `BACKEND_ERROR` | 503 | Next.js could not reach the real backend |
| `SERVICE_UNAVAILABLE` | 503 | Backend reachable but returned a non-2xx response |
| `INTERNAL_ERROR` | 500 | Unexpected server-side error |
| `REQUEST_TIMEOUT` | 408 | Client-side fetch exceeded `timeoutMs` (10 s default) |
| `NETWORK_ERROR` | 503 | `fetch()` threw before receiving any response |
| `INVALID_JSON` | — | Response body was not valid JSON |
| `INVALID_ENVELOPE` | — | JSON parsed but did not match the success/error shape |

### Switching from Mock to Real Backend

1. Set the server-only env vars (`.env.local` or hosting secrets):
   ```bash
   NEUROWEALTH_API_BASE_URL=https://api.neurowealth.app
   NEUROWEALTH_API_AUTH_TOKEN=your-secret-token
   ```

2. Implement `RealBackendAuthAdapter` in `src/lib/auth-adapter-real.ts` that satisfies the `AuthAdapter` interface (`src/lib/auth-adapter.ts`). The real backend's sign-in and sign-up endpoints must return `AuthSession` inside the standard success envelope.

3. Wire it up in `src/lib/auth-provider-factory.ts`:
   ```ts
   import { realAuth } from "./auth-adapter-real";

   export function getAuthAdapter(): AuthAdapter {
     return process.env.NEUROWEALTH_API_BASE_URL ? realAuth : mockAuth;
   }
   ```

4. In route handlers, replace direct `fetch` calls with `createServerApiClient()` from `src/lib/api-client.ts` to ensure the bearer token is always present.

## Documentation

- [Networks](docs/networks.md): frontend network switching config and current mainnet scope boundaries.
- [Environment](docs/env.md): server-only vs `NEXT_PUBLIC_*` env, and future Edge runtime constraints.
- [Third-party scripts](docs/third-party-scripts.md): how to add analytics/SDK scripts using `next/script` without hurting LCP.
- [Security Policy](SECURITY.md): private vulnerability reporting process and response expectations.

## Pull Request Guidelines

### Before Submitting

1. **Run linting and type checking**
   ```bash
   yarn lint
   yarn typecheck
   ```

2. **Build the project**
   ```bash
   yarn build
   ```

3. **Add `data-qa` attributes** to critical E2E flows
   - Primary CTAs
   - Wallet connect buttons
   - Transaction submit buttons
   - See issue #160 for naming pattern

### PR Expectations

- **Branch protection**: Direct pushes to `main` are not allowed. All changes must go through pull requests.
- **Issue linkage**: Link your PR to related issues using the issue tracker.
- **Review process**: All PRs require at least one approval before merging.
- **Tests**: Ensure new features include appropriate tests (unit or E2E).
- **Documentation**: Update relevant documentation for new features or breaking changes.

### Issue Templates

Use the appropriate issue template when reporting bugs or requesting features:
- Bug Report
- Feature Request
- Enhancement

See the [issue queue](https://github.com/NeuroWealth/NeuroWealth-Frontend/issues) for open issues and priorities.
