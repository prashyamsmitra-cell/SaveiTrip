import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getGoogleStatus, login } from "./authApi";
import { useAuth } from "./AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState<boolean | null>(null);

  useEffect(() => {
    getGoogleStatus().then((status) => setGoogleReady(status.configured)).catch(() => setGoogleReady(false));
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
    <AuthFrame title="Welcome back." subtitle="Continue into your travel intelligence workspace.">
      <button
        type="button"
        disabled={!googleReady}
        onClick={() => {
          window.location.href = "/api/google/start";
        }}
        className="w-full rounded-sm border border-line bg-surface px-5 py-3 text-sm text-ink transition hover:border-ink disabled:cursor-not-allowed disabled:text-ink-faint"
      >
        {googleReady ? "Continue with Google" : "Google sign-in not configured"}
      </button>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
        <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="Minimum 8 characters" />
        {error && <p className="rounded-sm bg-accent-red-soft px-4 py-3 text-sm text-accent-red">{error}</p>}
        <button disabled={loading} className="w-full rounded-sm bg-ink px-5 py-3 text-sm font-medium text-canvas transition hover:-translate-y-0.5 disabled:opacity-60">
          {loading ? "Signing in..." : "Log in"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-soft">
        New to SaveiTrip? <Link to="/signup" className="text-ink underline underline-offset-4">Create an account</Link>
      </p>
    </AuthFrame>
  );
}

export function AuthFrame({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen bg-canvas md:grid-cols-[0.95fr_1.05fr]">
      <section className="relative hidden overflow-hidden md:block">
        <img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80" alt="Warm mountain valley at sunrise" />
        <div className="absolute inset-0 bg-ink/35" />
        <Link to="/" className="font-display absolute left-10 top-8 text-xl text-canvas">SaveiTrip</Link>
        <p className="absolute bottom-10 left-10 max-w-sm text-2xl font-medium leading-tight text-canvas">Travel should feel exciting and informed at the same time.</p>
      </section>
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="font-display text-xl md:hidden">Savei<span className="text-accent-green">Trip</span></Link>
          <h1 className="font-display mt-10 text-4xl leading-tight md:mt-0">{title}</h1>
          <p className="mt-3 text-ink-soft">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </section>
    </div>
  );
}

export function Field({ label, type, value, onChange, placeholder }: { label: string; type: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="block text-sm">
      <span className="text-ink-soft">{label}</span>
      <input
        required
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-sm border border-line bg-surface px-4 py-3 outline-none transition focus:border-ink focus:ring-2 focus:ring-accent-green-soft"
      />
    </label>
  );
}
