export type AuthProvider = "email" | "google";

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
  createdAt: string;
  updatedAt: string;
};

type AuthResponse = {
  token: string;
  user: User;
};

const API_URL = import.meta.env.VITE_API_URL ?? "";
const TOKEN_KEY = "saveitrip_token";
const USER_KEY = "saveitrip_user";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
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

export function saveSession(session: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, session.token);
  localStorage.setItem(USER_KEY, JSON.stringify(session.user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
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
  const token = getStoredToken();
  return request<{ user: User }>('/api/auth/me', {
    method: 'PATCH',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
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

export async function fetchMe(token: string) {
  return request<{ user: User }>("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function logout() {
  await request<void>("/api/auth/logout", { method: "POST" }).catch(() => undefined);
  clearSession();
}

export async function getGoogleStatus() {
  return request<{ configured: boolean; redirectUri: string }>("/api/google/status");
}
