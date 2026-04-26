import { Lock } from "lucide-react";
import { ErrorPage } from "@/components/ui/ErrorPage";

export const dynamic = "force-dynamic";

export default function UnauthorizedPage() {
  return (
    <ErrorPage
      statusCode={401}
      title="Authentication required"
      description="You need to sign in to access this page. Please connect your wallet or sign in to continue."
      icon={<Lock size={32} />}
      primaryAction={{ label: "Sign in", href: "/login" }}
      secondaryAction={{ label: "Back to home", href: "/" }}
    />
  );
}
