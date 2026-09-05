import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { clearSession, fetchMe, getStoredToken, getStoredUser, saveSession, type User } from "./authApi";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isHelper: boolean;
  loading: boolean;
  setSession: (session: { token: string; user: User }, accountType?: "traveler" | "helper") => void;
  updateUser: (user: User) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const ACCOUNT_TYPE_KEY = "saveitrip_account_type";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [isHelper, setIsHelper] = useState(
    () => localStorage.getItem(ACCOUNT_TYPE_KEY) === "helper" || window.location.pathname.startsWith("/helper/")
  );
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
      isHelper,
      loading,
      setSession: (session, accountType = "traveler") => {
        saveSession(session);
        setToken(session.token);
        setUser(session.user);
        setIsHelper(accountType === "helper");
        localStorage.setItem(ACCOUNT_TYPE_KEY, accountType);
      },
      updateUser: (nextUser) => {
        setUser(nextUser);
        const storedToken = getStoredToken();
        if (storedToken) saveSession({ token: storedToken, user: nextUser });
      },
      signOut: () => {
        clearSession();
        setToken(null);
        setUser(null);
        setIsHelper(false);
        localStorage.removeItem(ACCOUNT_TYPE_KEY);
      }
    }),
    [isHelper, loading, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
