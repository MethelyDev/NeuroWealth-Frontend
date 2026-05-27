/**
 * Typed environment variable access with validation.
 * Validates all required environment variables at startup.
 * Add all NEXT_PUBLIC_* vars here so they're validated at startup.
 *
 * ── Variable reference ────────────────────────────────────────────────────────
 *
 * Public — embedded in the browser bundle (safe to expose):
 *   NEXT_PUBLIC_WEBHOOK_URL          WhatsApp / webhook receiver URL
 *   NEXT_PUBLIC_API_URL              Base URL for internal Next.js /api/* routes
 *   NEXT_PUBLIC_STELLAR_NETWORK      "mainnet" | "testnet"
 *   NEXT_PUBLIC_STELLAR_HORIZON_URL  Stellar Horizon endpoint for the SDK
 *   NEXT_PUBLIC_DEMO_SEED            Optional seed for deterministic mock data
 *
 * Server-only — never sent to the browser (set via .env.local or hosting secrets):
 *   NEUROWEALTH_API_BASE_URL         Real backend base URL
 *                                    (e.g. https://api.neurowealth.app)
 *                                    When unset the app falls back to demo data.
 *   NEUROWEALTH_API_AUTH_TOKEN       Bearer token for server→backend requests.
 *                                    Required whenever NEUROWEALTH_API_BASE_URL is set.
 *                                    Injected as: Authorization: Bearer <token>
 *   NEUROWEALTH_PORTFOLIO_PATH       Backend path for portfolio data
 *                                    (default: /portfolio/overview)
 *   NEUROWEALTH_TRANSACTIONS_PATH    Backend path for transaction submission
 *                                    (default: /transactions)
 *   NEUROWEALTH_STRATEGY_PATH        Backend path for strategy preference
 *                                    (default: /strategy/preference)
 */

interface EnvConfig {
  /** NEXT_PUBLIC_WEBHOOK_URL — WhatsApp webhook receiver URL. */
  webhookUrl: string;
  /** NEXT_PUBLIC_API_URL — Base URL for internal Next.js /api/* routes. */
  apiUrl: string;
  /** NEUROWEALTH_API_BASE_URL — Real backend base URL; empty string means demo mode. */
  neuroWealthApiBaseUrl: string;
  /** NEUROWEALTH_API_AUTH_TOKEN — Bearer token sent to the real backend. */
  neuroWealthApiAuthToken: string;
  /** NEUROWEALTH_PORTFOLIO_PATH — Backend path for portfolio data. */
  neuroWealthPortfolioPath: string;
  /** NEUROWEALTH_TRANSACTIONS_PATH — Backend path for transaction submission. */
  neuroWealthTransactionsPath: string;
  /** NEUROWEALTH_STRATEGY_PATH — Backend path for strategy preference reads/writes. */
  neuroWealthStrategyPath: string;
}

function validateEnv(): EnvConfig {
  const errors: string[] = [];

  // Public variables (safe to expose to browser)
  const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Server-only variables
  const neuroWealthApiBaseUrl = process.env.NEUROWEALTH_API_BASE_URL ?? "";
  const neuroWealthApiAuthToken = process.env.NEUROWEALTH_API_AUTH_TOKEN ?? "";
  const neuroWealthPortfolioPath =
    process.env.NEUROWEALTH_PORTFOLIO_PATH ?? "/portfolio/overview";
  const neuroWealthTransactionsPath =
    process.env.NEUROWEALTH_TRANSACTIONS_PATH ?? "/transactions";
  const neuroWealthStrategyPath =
    process.env.NEUROWEALTH_STRATEGY_PATH ?? "/strategy/preference";

  // Validate required public variables
  if (!webhookUrl) {
    errors.push(
      "NEXT_PUBLIC_WEBHOOK_URL is required. Add it to .env.local or .env",
    );
  }

  if (!apiUrl) {
    errors.push(
      "NEXT_PUBLIC_API_URL is required. Add it to .env.local or .env",
    );
  }

  if (process.env.NODE_ENV === "development") {
    if (!neuroWealthApiBaseUrl) {
      console.warn(
        "[env] NEUROWEALTH_API_BASE_URL not set. Using demo data for portfolio and transactions.",
      );
    } else if (!neuroWealthApiAuthToken) {
      console.warn(
        "[env] NEUROWEALTH_API_BASE_URL is set but NEUROWEALTH_API_AUTH_TOKEN is missing. " +
        "Server→backend requests will not include an Authorization header.",
      );
    }
  }

  if (errors.length > 0) {
    const message = `Environment validation failed:\n${errors.join("\n")}`;
    throw new Error(message);
  }

  return {
    webhookUrl: webhookUrl!,
    apiUrl: apiUrl!,
    neuroWealthApiBaseUrl,
    neuroWealthApiAuthToken,
    neuroWealthPortfolioPath,
    neuroWealthTransactionsPath,
    neuroWealthStrategyPath,
  };
}

// Validate on module load
let cachedEnv: EnvConfig | null = null;

export function getEnv(): EnvConfig {
  if (!cachedEnv) {
    cachedEnv = validateEnv();
  }
  return cachedEnv;
}

// For backward compatibility, export as const
export const env = getEnv();
