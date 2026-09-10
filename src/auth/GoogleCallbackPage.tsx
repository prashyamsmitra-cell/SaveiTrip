import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Brand, Spinner } from "../shared/ui";

export default function GoogleCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard", { replace: true });
  }, [navigate]);

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
