/**
 * Unified API response envelope for all /api/* routes.
 * Ensures consistent error handling and response shape across the application.
 */

export interface ApiErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        details?: Record<string, string | string[]>;
    };
}

export interface ApiSuccessResponse<T = unknown> {
    success: true;
    data: T;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Standard HTTP status codes for API errors
 */
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Error codes for consistent error identification
 */
export const ERROR_CODE = {
    VALIDATION_ERROR: "VALIDATION_ERROR",
    UNAUTHORIZED: "UNAUTHORIZED",
    FORBIDDEN: "FORBIDDEN",
    NOT_FOUND: "NOT_FOUND",
    INTERNAL_ERROR: "INTERNAL_ERROR",
    SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
    BACKEND_ERROR: "BACKEND_ERROR",
} as const;

/**
 * Create a success response
 */
export function successResponse<T>(data: T): ApiSuccessResponse<T> {
    return {
        success: true,
        data,
    };
}

function normalizeErrorDetails(
    details: object,
): Record<string, string | string[]> | undefined {
    const entries = Object.entries(details).filter(
        (e): e is [string, string | string[]] =>
            e[1] !== undefined &&
            (typeof e[1] === "string" || Array.isArray(e[1])),
    );
    if (!entries.length) return undefined;
    return Object.fromEntries(entries);
}

/**
 * Maximum allowed request body size for POST API routes (100 KB).
 * Aligns with Vercel's default serverless function body limit.
 * Documented here so all routes share the same constant.
 */
export const MAX_BODY_BYTES = 100 * 1024; // 100 KB

/**
 * Read and parse a JSON request body, enforcing a byte-size limit.
 *
 * Returns `{ ok: true, data }` on success, or
 * `{ ok: false, response }` with a ready-to-return NextResponse on failure.
 *
 * Usage in a route handler:
 *   const result = await readJsonBody(request);
 *   if (!result.ok) return result.response;
 *   const raw = result.data;
 */
export async function readJsonBody(
    request: Request,
    maxBytes = MAX_BODY_BYTES,
): Promise<
    | { ok: true; data: unknown }
    | { ok: false; response: import("next/server").NextResponse }
> {
    const { NextResponse } = await import("next/server");

    // Check Content-Length header first (fast path — not always present)
    const contentLength = request.headers.get("content-length");
    if (contentLength !== null && parseInt(contentLength, 10) > maxBytes) {
        return {
            ok: false,
            response: NextResponse.json(
                errorResponse(
                    "PAYLOAD_TOO_LARGE",
                    `Request body must not exceed ${maxBytes / 1024} KB.`,
                ),
                { status: 413 },
            ),
        };
    }

    // Read the raw bytes so we can enforce the limit even without Content-Length
    let bytes: Uint8Array;
    try {
        const arrayBuffer = await request.arrayBuffer();
        bytes = new Uint8Array(arrayBuffer);
    } catch {
        return {
            ok: false,
            response: NextResponse.json(
                errorResponse("VALIDATION_ERROR", "Failed to read request body."),
                { status: 400 },
            ),
        };
    }

    if (bytes.byteLength > maxBytes) {
        return {
            ok: false,
            response: NextResponse.json(
                errorResponse(
                    "PAYLOAD_TOO_LARGE",
                    `Request body must not exceed ${maxBytes / 1024} KB.`,
                ),
                { status: 413 },
            ),
        };
    }

    try {
        const text = new TextDecoder().decode(bytes);
        return { ok: true, data: JSON.parse(text) };
    } catch {
        return {
            ok: false,
            response: NextResponse.json(
                errorResponse("VALIDATION_ERROR", "Request body must be valid JSON.", {
                    body: ["Malformed JSON payload."],
                }),
                { status: 400 },
            ),
        };
    }
}

/**
 * Create an error response.
 * `details` accepts any plain object (e.g. field error maps); non-string values are omitted.
 */
export function errorResponse(
    code: string,
    message: string,
    details?: object,
): ApiErrorResponse {
    const normalized = details ? normalizeErrorDetails(details) : undefined;
    return {
        success: false,
        error: {
            code,
            message,
            ...(normalized && { details: normalized }),
        },
    };
}
