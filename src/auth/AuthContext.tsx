import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { clearSession, fetchMe, getStoredUser, saveSession, type User } from "./authApi";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isHelper: boolean;
  isBusiness: boolean;
  isAdmin: boolean;
  role: string;
  loading: boolean;
  setSession: (session: { user: User; token?: string }, accountType?: "traveler" | "helper") => void;
  updateUser: (user: User) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const ACCOUNT_TYPE_KEY = "saveitrip_account_type";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [token, setToken] = useState<string | null>(null);
  const [isHelper, setIsHelper] = useState(
    () => localStorage.getItem(ACCOUNT_TYPE_KEY) === "helper" || window.location.pathname.startsWith("/helper/")
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMe()
      .then((session) => {
        if (!session) {
          clearSession();
          setUser(null);
          setLoading(false);
          return;
        }

        const { user } = session;
        setUser(user);
        saveSession({ user });
        setLoading(false);
      })
      .catch(() => {
        clearSession();
        setUser(null);
        setLoading(false);
      });
  }, []);

  const setSession = useCallback((session: { user: User; token?: string }, accountType: "traveler" | "helper" = "traveler") => {
    saveSession(session);
    setToken(session.token ?? null);
    setUser(session.user);
    setIsHelper(accountType === "helper");
    localStorage.setItem(ACCOUNT_TYPE_KEY, accountType);
  }, []);

  const updateUser = useCallback((nextUser: User) => {
    setUser(nextUser);
    saveSession({ user: nextUser });
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setToken(null);
    setUser(null);
    setIsHelper(false);
    localStorage.removeItem(ACCOUNT_TYPE_KEY);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isHelper,
      isBusiness: user?.role === "business",
      isAdmin: user?.role === "admin",
      role: user?.role ?? "traveler",
      loading,
      setSession,
      updateUser,
      signOut
    }),
    [isHelper, loading, setSession, signOut, token, updateUser, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
