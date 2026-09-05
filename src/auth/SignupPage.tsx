import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "./authApi";
import { useAuth } from "./AuthContext";
import { AuthFrame, Field } from "./LoginPage";
import { Icon } from "../shared/Icon";
import { Spinner } from "../shared/ui";

export default function SignupPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const session = await signup({ name, email, password });
      setSession(session);
      navigate("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthFrame compact title="Create your workspace." subtitle="Save trip ideas now. Connect intelligence services as they launch.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Name" type="text" value={name} onChange={setName} placeholder="Prashyam" autoComplete="name" />
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" autoComplete="email" />
        <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="Minimum 8 characters" autoComplete="new-password" />
        {error && (
          <div className="alert-error" role="alert">
            <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <button disabled={loading} className="btn btn-primary mt-2 w-full justify-center">
          {loading ? (
            <>
              <Spinner /> Creating account...
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>
      <p className="mt-7 text-center text-sm text-ink-soft">
        Already registered?{" "}
        <Link to="/login" className="font-medium text-ink underline underline-offset-4 hover:text-accent-green transition-colors">
          Log in
        </Link>
      </p>
    </AuthFrame>
  );
}
