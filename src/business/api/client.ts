// Shared authenticated API client for the Endorsement module.
//
// SavesiTrip uses cookie-backed sessions, so authenticated requests rely on the
// browser sending the HttpOnly session cookie instead of a client-stored token.

const API_URL = import.meta.env.VITE_API_URL ?? "";

export class ApiError extends Error {
  readonly status: number;
  readonly issues?: unknown;

  constructor(message: string, status: number, issues?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.issues = issues;
  }
}

export async function authenticatedRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    let issues: unknown;
    try {
      const body = await response.json();
      if (body?.message) message = body.message;
      if (body?.issues) issues = body.issues;
    } catch {
      // Non-JSON error body; fall back to status text / default message.
      if (response.status === 401) message = "Session expired or invalid. Please log in again.";
      if (response.status === 403) message = "Insufficient permissions for this operation.";
    }
    throw new ApiError(message, response.status, issues);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function getEndpointToken(): string | null {
  return null;
}
