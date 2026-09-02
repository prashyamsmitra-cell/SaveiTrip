import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { Brand, Spinner } from "../shared/ui";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-canvas">
        <div className="flex flex-col items-center gap-4">
          <Brand className="text-xl" />
          <div className="flex items-center gap-3 text-sm text-ink-soft">
            <Spinner className="h-5 w-5 text-accent-green" />
            Preparing your workspace...
          </div>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}
