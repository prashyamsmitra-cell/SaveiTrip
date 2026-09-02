import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { User } from "./authApi";
import { Brand, Spinner } from "../shared/ui";

export default function GoogleCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setSession } = useAuth();

  useEffect(() => {
    const token = params.get("token");
    const rawUser = params.get("user");

    if (!token || !rawUser) {
      navigate("/login");
      return;
    }

    setSession({ token, user: JSON.parse(rawUser) as User });
    navigate("/dashboard");
  }, [navigate, params, setSession]);

  return (
    <div className="grid min-h-screen place-items-center bg-canvas">
      <div className="flex flex-col items-center gap-4">
        <Brand className="text-xl" />
        <div className="flex items-center gap-3 text-sm text-ink-soft">
          <Spinner className="h-5 w-5 text-accent-green" />
          Finishing Google sign-in...
        </div>
      </div>
    </div>
  );
}
