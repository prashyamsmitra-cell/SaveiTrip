import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { helperLogin, signupHelper } from "./authApi";
import { useAuth } from "./AuthContext";
import { AuthFrame, Field } from "./LoginPage";
import { Icon } from "../shared/Icon";
import { Spinner } from "../shared/ui";

export default function HelperAuthPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [loading, setLoading] = useState(false);
  const loginText = "Log in as helper";
  const signupText = "Create helper account";

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  async function handleLoginSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const session = await helperLogin({ email: loginEmail, password: loginPassword });
      setSession(session, "helper");
      navigate("/helper/dashboard");
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Helper login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignupSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const session = await signupHelper({
        name: signupName,
        email: signupEmail,
        password: signupPassword
      });
      setSession(session, "helper");
      navigate("/helper/profile-setup");
    } catch (error) {
      setSignupError(error instanceof Error ? error.message : "Helper signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthFrame compact title="Welcome back." subtitle="Continue into your travel intelligence workspace.">
      <h2 className="font-display text-2xl leading-tight mb-6 text-center">Helper Access</h2>

      {mode === 'login' && loginError && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-800">
          <Icon name="alert" className="h-4 w-4 shrink-0 me-2" />
          <span>{loginError}</span>
        </div>
      )}

      {mode === 'signup' && signupError && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-800">
          <Icon name="alert" className="h-4 w-4 shrink-0 me-2" />
          <span>{signupError}</span>
        </div>
      )}

      <form onSubmit={mode === 'login' ? handleLoginSubmit : handleSignupSubmit} className="space-y-4">
        {mode === 'login' && (
          <div>
            <Field
              label="Email"
              type="email"
              value={loginEmail}
              onChange={setLoginEmail}
              placeholder="you@example.com"
              autoComplete="email"
            />
            <Field
              label="Password"
              type="password"
              value={loginPassword}
              onChange={setLoginPassword}
              placeholder="Minimum 8 characters"
              autoComplete="current-password"
            />
            {loginError && (
              <div className="alert-error" role="alert">
                <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}
          </div>
        )}

        {mode === 'signup' && (
          <div>
            <Field
              label="Name"
              type="text"
              value={signupName}
              onChange={setSignupName}
              placeholder="Your full name"
              autoComplete="name"
            />
            <Field
              label="Email"
              type="email"
              value={signupEmail}
              onChange={setSignupEmail}
              placeholder="you@example.com"
              autoComplete="email"
            />
            <Field
              label="Password"
              type="password"
              value={signupPassword}
              onChange={setSignupPassword}
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
            />
            {signupError && (
              <div className="alert-error" role="alert">
                <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{signupError}</span>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex items-center gap-3 text-ink-faint">
          <span />
          <span className="text-xs font-medium uppercase tracking-wide">or</span>
          <span />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full justify-center"
        >
          {loading ? (
            <>
              <Spinner /> Processing...
            </>
          ) : (
            mode === 'login' ? loginText : signupText
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-ink-soft">
          Already have a helper account?{" "}
          <button
            onClick={() => setMode('login')}
            className="font-medium text-ink underline underline-offset-4 hover:text-accent-green transition-colors"
          >
            Log in
          </button>
        </p>
        <p className="mt-2 text-ink-soft">
          New to SaveiTrip?{" "}
          <Link to="/helper/signup" className="font-medium text-ink underline underline-offset-4 hover:text-accent-green transition-colors">
            Create helper account
          </Link>
        </p>
      </div>
    </AuthFrame>
  );
}