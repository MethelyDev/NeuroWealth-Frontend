import { NextResponse, type NextRequest } from "next/server";
import {
  isAuthOnlyPath,
  isProtectedPath,
  SESSION_COOKIE_NAME,
  SIGN_IN_PATH,
} from "./src/lib/auth-constants";

function isSessionCookieValid(rawCookie: string | undefined): boolean {
  if (!rawCookie) return false;

  try {
    const session = JSON.parse(decodeURIComponent(rawCookie)) as {
      token?: string;
      expiresAt?: number;
    };

    return (
      typeof session.token === "string" &&
      typeof session.expiresAt === "number" &&
      Date.now() < session.expiresAt
    );
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const cookieValue = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const authenticated = isSessionCookieValid(cookieValue);
  const url = request.nextUrl.clone();

  if (!authenticated && isProtectedPath(url.pathname)) {
    url.pathname = SIGN_IN_PATH;
    url.searchParams.set("from", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(url);
  }

  if (authenticated && isAuthOnlyPath(url.pathname)) {
    url.pathname = "/dashboard";
    url.searchParams.delete("from");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile",
    "/profile/:path*",
    "/settings",
    "/settings/:path*",
    "/login",
    "/signup",
  ],
};
