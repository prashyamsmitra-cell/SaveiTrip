import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getGoogleStatus, helperLogin, loginAsDemo } from "./authApi";
import { useAuth } from "./AuthContext";
import { Icon } from "../shared/Icon";
import { Spinner } from "../shared/ui";
import { AuthFrame, Field, GoogleMark } from "./LoginPage";
import { getMyHelperProfile } from "../travelHelper/travelHelperApi";

export default function HelperLoginPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState<boolean | null>(null);

  useEffect(() => {
    getGoogleStatus()
      .then((status) => setGoogleReady(status.configured))
      .catch(() => setGoogleReady(false));
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const session = await helperLogin({ email, password });
      setSession(session, "helper");
      const { profile } = await getMyHelperProfile();
      navigate(profile ? "/helper/dashboard" : "/helper/profile-setup");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Helper login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthFrame compact title="Welcome back." subtitle="Continue into your travel intelligence workspace.">
      <button
        type="button"
        disabled={!googleReady}
        onClick={() => {
          window.location.href = "/api/google/start";
        }}
        className="btn w-full justify-center border border-line bg-surface-high text-ink! hover:border-ink hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-50"
      >
        {googleReady ? (
          <>
            <GoogleMark />
            Continue with Google
          </>
        ) : (
          "Google sign-in not configured"
        )}
      </button>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Minimum 8 characters"
          autoComplete="current-password"
        />
        {error && (
          <div className="alert-error" role="alert">
            <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <button disabled={loading} className="btn btn-primary w-full justify-center">
          {loading ? (
            <>
              <Spinner /> Signing in...
            </>
          ) : (
            "Log in"
          )}
        </button>
      </form>

      <div className="mt-6 flex items-center gap-3 text-ink-faint">
        <span className="h-px flex-1 bg-line" />
        <span className="text-xs font-medium uppercase tracking-wide">or</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={async () => {
          setError("");
          setLoading(true);
          try {
            const session = await loginAsDemo();
            setSession(session, "helper");
            const { profile } = await getMyHelperProfile();
            navigate(profile ? "/helper/dashboard" : "/helper/profile-setup");
          } catch (error) {
            setError(error instanceof Error ? error.message : "Demo login failed. Please try again.");
          } finally {
            setLoading(false);
          }
        }}
        className="btn btn-soft-green mt-4 w-full justify-center"
      >
        Explore with a demo account
      </button>

      <p className="mt-5 text-center text-sm text-ink-soft">
        New to helping travelers?{" "}
        <Link to="/helper/signup" className="font-medium text-ink underline underline-offset-4 hover:text-accent-green transition-colors">
          Create a helper account
        </Link>
      </p>
    </AuthFrame>
  );
}