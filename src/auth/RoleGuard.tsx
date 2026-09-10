import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { Brand, Spinner } from "../shared/ui";
import type { UserRole } from "./authApi";

type RoleGuardProps = {
  roles: UserRole[];
  children: ReactNode;
  redirectTo?: string;
};

export default function RoleGuard({ roles, children, redirectTo }: RoleGuardProps) {
  const { user, loading, role } = useAuth();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-canvas">
        <div className="flex flex-col items-center gap-4">
          <Brand className="text-xl" />
          <div className="flex items-center gap-3 text-sm text-ink-soft">
            <Spinner className="h-5 w-5 text-accent-green" />
            Checking your access...
          </div>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(role as UserRole)) {
    return <Navigate to={redirectTo ?? "/dashboard"} replace />;
  }
  return <>{children}</>;
}
