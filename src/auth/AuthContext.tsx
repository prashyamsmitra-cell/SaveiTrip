import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { clearSession, fetchMe, getStoredToken, getStoredUser, saveSession, type User } from "./authApi";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  setSession: (session: { token: string; user: User }) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [loading, setLoading] = useState(Boolean(getStoredToken()));

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetchMe(token)
      .then(({ user }) => {
        setUser(user);
        saveSession({ token, user });
      })
      .catch(() => {
        clearSession();
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      setSession: (session) => {
        saveSession(session);
        setToken(session.token);
        setUser(session.user);
      },
      signOut: () => {
        clearSession();
        setToken(null);
        setUser(null);
      }
    }),
    [loading, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
