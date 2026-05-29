import type { Metadata } from "next";
import { Suspense } from "react";
import { PortfolioDashboard } from "@/components/dashboard/PortfolioDashboard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardSkeleton } from "@/components/ui/Skeleton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Your NeuroWealth portfolio overview — track yields, strategies, and transaction history.",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<DashboardSkeleton />}>
        <PortfolioDashboard />
      </Suspense>
    </ProtectedRoute>
  );
}
