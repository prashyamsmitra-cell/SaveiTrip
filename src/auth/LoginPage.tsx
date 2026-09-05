import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getGoogleStatus, login, loginAsDemo } from "./authApi";
import { useAuth } from "./AuthContext";
import { Icon } from "../shared/Icon";
import { Brand, Spinner } from "../shared/ui";

export default function LoginPage() {
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
      const session = await login({ email, password });
      setSession(session);
      navigate("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed. Please try again.");
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
            setSession(session);
            navigate("/dashboard");
          } catch (error) {
            setError(error instanceof Error ? error.message : "Demo login failed. Please try again.");
          } finally {
            setLoading(false);
          }
        }}
        className="btn btn-soft-green mt-4 w-full justify-center"
      >
        Log in as dummy traveler
      </button>

      <p className="mt-5 text-center text-sm text-ink-soft">
        New to SaveiTrip?{" "}
        <Link to="/signup" className="font-medium text-ink underline underline-offset-4 hover:text-accent-green transition-colors">
          Create an account
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-ink-soft">
        Are you a travel helper?{" "}
        <Link to="/helper/login" className="font-medium text-ink underline underline-offset-4 hover:text-accent-green transition-colors">
          Use helper login
        </Link>
      </p>
    </AuthFrame>
  );
}

export function GoogleMark() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.35 11.1H12v2.9h5.35c-.25 1.6-1.9 4.45-5.35 4.45-3.2 0-5.85-2.65-5.85-5.9S9 6.9 12 6.9c1.8 0 3.05.77 3.75 1.45l2.55-2.5C16.8 4.5 14.6 3.4 12 3.4 7.15 3.4 3.2 7.3 3.2 12s3.95 8.6 8.8 8.6c5.1 0 8.5-3.6 8.5-8.5 0-.55-.05-1-.15-1.45Z"
      />
    </svg>
  );
}

/* ─── AuthFrame Component ──────────────────────────────────────────────────────────── */
export function AuthFrame({ title, subtitle, children, compact = true }: { title: string; subtitle: string; children: ReactNode; compact?: boolean }) {
  return (
    <div className={`grid bg-canvas lg:grid-cols-[1fr_1.05fr] ${compact ? "h-screen max-h-screen overflow-hidden" : "min-h-screen"}`}>
      <section className="relative hidden min-h-screen overflow-hidden lg:block">
        <img
          className="h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1524230507669-5ff97982bb5e?q=80&w=664&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Travel Destination"
        />
        <div className="absolute inset-0 bg-linear-to-t from-ink/92 via-ink/40 to-ink/30" />
        <Link to="/" className="absolute left-10 top-9">
          <Brand className="text-xl text-canvas" />
        </Link>
        <div className="absolute inset-x-10 bottom-12 max-w-md">
          <p className="font-display text-[1.65rem] leading-snug text-canvas [text-shadow:0_2px_20px_rgba(0,0,0,0.4)]">
            Travel should feel exciting and informed at the same time.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-canvas/25 pt-5 text-xs font-medium text-canvas/70">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="shield-check" className="h-3.5 w-3.5 text-accent-amber" /> Secure sessions
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="sparkles" className="h-3.5 w-3.5 text-accent-green" /> AI-powered insights
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="pin" className="h-3.5 w-3.5 text-canvas/80" /> Built for India
            </span>
          </div>
        </div>
      </section>

      <section className={`relative flex justify-center px-6 ${compact ? "h-dvh max-h-dvh min-h-0 items-center overflow-hidden py-4 lg:py-6" : "min-h-dvh items-start overflow-y-auto py-8 lg:items-center lg:py-12"}`}>
        <Link to="/" className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-high px-3 py-2 text-xs font-medium text-ink-soft shadow-sm transition-colors hover:border-ink hover:text-ink lg:right-8 lg:top-8">
          <Icon name="arrow-left" className="h-3.5 w-3.5" />
          Back to home
        </Link>
        <div className={`w-full page-fade ${compact ? "max-w-sm" : "max-w-md"}`}>
          <Link to="/" className="lg:hidden">
            <Brand className="text-xl" />
          </Link>
          <h1 className={`font-display leading-[1.05] ${compact ? "mt-5 text-3xl lg:mt-0 md:text-4xl" : "mt-8 text-4xl lg:mt-0 md:text-5xl"}`}>{title}</h1>
          <p className={`text-ink-soft ${compact ? "mt-2 leading-6" : "mt-3 leading-7"}`}>{subtitle}</p>
          <div className={compact ? "mt-5" : "mt-7"}>{children}</div>
        </div>
      </section>
    </div>
  );
}

/* ─── Field Component ──────────────────────────────────────────────────────────── */
export function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete
}: {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input
        required
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="input"
      />
    </label>
  );
}