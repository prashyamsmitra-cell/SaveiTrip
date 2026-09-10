export type AuthProvider = "email" | "google";

export type UserRole = "traveler" | "helper" | "business" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  authProvider: AuthProvider;
  googleId: string | null;
  phone: string | null;
  bio: string | null;
  username: string | null;
  avatarUrl: string | null;
  role?: UserRole;
  createdAt: string;
  updatedAt: string;
};

type AuthResponse = {
  user: User;
  token?: string;
};

const API_URL = import.meta.env.VITE_API_URL ?? "";
const USER_KEY = "saveitrip_user";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message ?? "Request failed. Please try again.");
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function saveSession(session: { user: User; token?: string }) {
  localStorage.setItem(USER_KEY, JSON.stringify(session.user));
}

export function clearSession() {
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}

export async function signup(input: { name: string; email: string; password: string }) {
  return request<AuthResponse>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function signupHelper(input: { name: string; email: string; password: string }) {
  return request<AuthResponse>("/api/auth/helper/signup", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function updateProfile(input: {
  name?: string;
  phone?: string;
  bio?: string;
  username?: string;
  avatarUrl?: string;
}) {
  return request<{ user: User }>('/api/auth/me', {
    method: 'PATCH',
    body: JSON.stringify(input)
  });
}

export async function login(input: { email: string; password: string }) {
  return request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function helperLogin(input: { email: string; password: string }) {
  return request<AuthResponse>("/api/auth/helper/login", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function loginAsDemo() {
  return request<AuthResponse>("/api/auth/demo", {
    method: "POST"
  });
}

export async function fetchMe(): Promise<{ user: User } | null> {
  try {
    return await request<{ user: User }>('/api/auth/me');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/401|Unauthorized|Missing authentication session|Invalid or expired session/i.test(message)) {
      return null;
    }
    throw error;
  }
}

export async function logout() {
  await request<void>("/api/auth/logout", { method: "POST" }).catch(() => undefined);
  clearSession();
}

export async function getGoogleStatus() {
  return request<{ configured: boolean; redirectUri: string }>("/api/google/status");
}
