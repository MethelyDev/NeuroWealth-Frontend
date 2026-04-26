import { redirect } from "next/navigation";

interface SignInPageProps {
  searchParams?: { from?: string };
}

export default function SignInPage({ searchParams }: SignInPageProps) {
  const destination = searchParams?.from
    ? `/login?from=${encodeURIComponent(searchParams.from)}`
    : "/login";

  redirect(destination);
}
