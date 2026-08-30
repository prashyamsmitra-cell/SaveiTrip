import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "./authApi";
import { useAuth } from "./AuthContext";
import { AuthFrame, Field } from "./LoginPage";

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
    <AuthFrame title="Create your workspace." subtitle="Save trip ideas now. Connect intelligence services as they launch.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Name" type="text" value={name} onChange={setName} placeholder="Prashyam" />
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
        <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="Minimum 8 characters" />
        {error && <p className="rounded-sm bg-accent-red-soft px-4 py-3 text-sm text-accent-red">{error}</p>}
        <button disabled={loading} className="w-full rounded-sm bg-ink px-5 py-3 text-sm font-medium text-canvas transition hover:-translate-y-0.5 disabled:opacity-60">
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-soft">
        Already registered? <Link to="/login" className="text-ink underline underline-offset-4">Log in</Link>
      </p>
    </AuthFrame>
  );
}
