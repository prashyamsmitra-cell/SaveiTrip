import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { User } from "./authApi";

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

  return <div className="grid min-h-screen place-items-center bg-canvas text-sm text-ink-soft">Finishing Google sign-in...</div>;
}
