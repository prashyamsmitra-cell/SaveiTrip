import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-canvas text-sm text-ink-soft">Preparing your workspace...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
}
