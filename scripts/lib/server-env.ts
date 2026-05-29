/**
 * Server-side / integration environment validation (WhatsApp, DB, Stellar).
 * Used by `yarn validate:env:server` — not imported by the Next.js app bundle.
 * For frontend runtime config see `src/lib/env.ts`.
 */
const requiredEnvVars = [
  "NEXT_PUBLIC_APP_ENV",
  "NEXT_PUBLIC_APP_URL",
  "WHATSAPP_APP_SECRET",
  "WHATSAPP_VERIFY_TOKEN",
  "WHATSAPP_ACCESS_TOKEN",
  "WHATSAPP_PHONE_NUMBER_ID",
  "WHATSAPP_WABA_ID",
  "DB_HOST",
  "DB_PORT",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
  "STELLAR_NETWORK",
  "STELLAR_HORIZON_URL",
  "WALLET_ENCRYPTION_KEY",
] as const;

export function validateServerEnv() {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map((k) => `  - ${k}`).join("\n")}`,
    );
  }

  const key = process.env.WALLET_ENCRYPTION_KEY!;
  if (!/^[a-f0-9]{64}$/i.test(key)) {
    throw new Error("WALLET_ENCRYPTION_KEY must be a 64-character hex string");
  }

  const network = process.env.STELLAR_NETWORK!;
  if (!["testnet", "mainnet"].includes(network)) {
    throw new Error("STELLAR_NETWORK must be 'testnet' or 'mainnet'");
  }
}
