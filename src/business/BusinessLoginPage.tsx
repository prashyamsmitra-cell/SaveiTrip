import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../auth/authApi";
import { useAuth } from "../auth/AuthContext";
import { Icon } from "../shared/Icon";
import { Spinner } from "../shared/ui";
import { AuthFrame, Field } from "../auth/LoginPage";

export default function BusinessLoginPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const session = await login({ email, password });
      if (session.user.role && session.user.role !== "business") {
        setError(
          session.user.role === "admin"
            ? "This is the business portal. Use the admin login for admin access."
            : "This account is not registered as a business. Contact SaveiTrip to onboard your business."
        );
        return;
      }
      setSession(session);
      navigate("/business/promote");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthFrame title="Business owner sign in." subtitle="Manage your endorsement and promotion with SaveiTrip.">
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@business.com"
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
            "Log in to business portal"
          )}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-ink-soft">
        New business?{" "}
        <Link to="/business/inquiry/new" className="font-medium text-ink underline underline-offset-4 hover:text-accent-green transition-colors">
          Start an endorsement inquiry
        </Link>{" "}
        or{" "}
        <Link to="/login" className="font-medium text-ink underline underline-offset-4 hover:text-accent-green transition-colors">
          back to traveler login
        </Link>
        .
      </p>
      <p className="mt-2 text-center text-xs text-ink-soft">
        Demo: use <span className="font-medium text-ink">business@saveitrip.com</span> /{" "}
        <span className="font-medium text-ink">Demo1234!</span>
      </p>
    </AuthFrame>
  );
}