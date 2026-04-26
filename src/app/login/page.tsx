"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts";
import { MAIN_CONTENT_LANDMARK_ID } from "@/lib/app-landmarks";
import { Loader2, Zap } from "lucide-react";

export const dynamic = "force-dynamic";

// Split out the inner component so useSearchParams is inside Suspense
function LoginContent() {
  const { signIn, user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/dashboard";

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.replace(from);
    }
  }, [loading, user, router, from]);

  const handleDemoSignIn = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 800));
      await signIn("demo@neurowealth.app", "password123");
      router.replace(from);
    } catch {
      setError("Sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [signIn, router, from]);

  return (
    <main
      id={MAIN_CONTENT_LANDMARK_ID}
      tabIndex={-1}
      className="min-h-screen bg-app-bg flex items-center justify-center px-4"
    >
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-bold text-text-primary">NeuroWealth</span>
        </div>

        <div className="card space-y-6">
          <div>
            <h1 className="text-xl font-bold text-text-primary">
              Sign in to your account
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Connect your wallet to access your dashboard.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg bg-error/10 border border-error/20 px-4 py-3 text-sm text-error"
            >
              {error}
            </div>
          )}

          <button
            onClick={handleDemoSignIn}
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-sm"
            aria-label="Continue with demo account"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                Connecting…
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" aria-hidden="true" />
                Continue with Demo Account
              </>
            )}
          </button>

          <p className="text-center text-xs text-text-muted">
            Wallet integration (Freighter) coming soon.
          </p>
        </div>
      </div>
    </main>
  );
}

// Wrap in Suspense to satisfy Next.js prerender requirements for useSearchParams
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}