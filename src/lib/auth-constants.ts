/**
 * Single source of truth for auth-related constants.
 *
 * Both middleware (Edge runtime) and client-side code import from here,
 * so the cookie name, storage key, and redirect paths are never duplicated.
 */

/** localStorage key used by mock-auth to persist the session */
export const SESSION_STORAGE_KEY = "neurowealth_session" as const;

/**
 * Cookie name written by middleware / login handler.
 * Must match what middleware reads and what the login API sets.
 *
 * This implementation is a demo flow: mock sessions are stored in
 * localStorage for client-side auth and mirrored to a non-httpOnly cookie
 * so middleware can verify whether a browser tab is authenticated.
 * In a real JWT flow, this contract should be replaced by a secure,
 * httpOnly session cookie or token verification endpoint.
 */
export const SESSION_COOKIE_NAME = "nw_session" as const;

/** Where to send unauthenticated users */
export const SIGN_IN_PATH = "/login" as const;

/** Where to land after a successful sign-in */
export const POST_SIGN_IN_PATH = "/dashboard" as const;

/** Routes that require an authenticated session */
export const PROTECTED_PREFIXES = [
  "/dashboard",
  "/profile",
  "/settings",
] as const;

/** Routes that should redirect authenticated users away (e.g. /login → /dashboard) */
export const AUTH_ONLY_PATHS = ["/login", "/signup"] as const;

/** Checks whether a pathname requires authentication */
export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

/** Checks whether a pathname should redirect already-authenticated users */
export function isAuthOnlyPath(pathname: string): boolean {
  return AUTH_ONLY_PATHS.some((p) => pathname === p || pathname.startsWith(p));
}
