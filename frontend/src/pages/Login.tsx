import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  HeartHandshake,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { login } from "../services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email address and password.");
      return;
    }

    try {
      setLoading(true);

      const data = await login(email.trim(), password);

      if (!data.success) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "caregiver") {
        navigate("/caregiver");
      } else if (data.user.role === "patient") {
        navigate("/home");
      } else {
        setError("We could not identify this account type.");
      }
    } catch (error) {
      console.error("Login failed:", error);

      setError(
        "Unable to connect to the service. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-introduction">
        <div className="auth-introduction-inner">
          <div className="brand">
            <div className="brand-mark" aria-hidden="true">
              S
            </div>

            <span className="brand-name">SMRITI</span>
          </div>

          <div className="auth-message">
            <p className="auth-eyebrow">MEMORY & DAILY WELLBEING</p>

            <h1>
              Familiar moments.
              <br />
              Meaningful connections.
            </h1>

            <p className="auth-description">
              A simple companion for memories, cognitive activities and
              everyday routines, keeping families connected along the way.
            </p>
          </div>

          <div className="auth-benefits">
            <div className="auth-benefit">
              <HeartHandshake size={22} strokeWidth={1.8} />

              <div>
                <strong>Family-centred</strong>
                <span>Personal memories and familiar faces</span>
              </div>
            </div>

            <div className="auth-benefit">
              <ShieldCheck size={22} strokeWidth={1.8} />

              <div>
                <strong>Caregiver connected</strong>
                <span>Support and progress in one place</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="auth-form-section">
        <div className="auth-form-wrapper">
          <div className="mobile-brand">
            <div className="brand-mark" aria-hidden="true">
              S
            </div>

            <span className="brand-name">SMRITI</span>
          </div>

          <div className="auth-heading">
            <p className="auth-small-label">WELCOME BACK</p>

            <h2>Sign in to your account</h2>

            <p>
              Continue to your personalized memory and wellbeing experience.
            </p>
          </div>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <div className="auth-fields">
            <div className="auth-field">
              <label htmlFor="email">Email address</label>

              <div className="auth-input-wrapper">
                <Mail size={20} aria-hidden="true" />

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>

              <div className="auth-input-wrapper">
                <LockKeyhole size={20} aria-hidden="true" />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            className="auth-submit"
            onClick={handleLogin}
            disabled={loading}
          >
            <span>{loading ? "Signing in..." : "Sign in"}</span>

            {!loading && <ArrowRight size={20} />}
          </button>

          <div className="auth-register">
            <span>New to SMRITI?</span>

            <button
              type="button"
              onClick={() => navigate("/register")}
            >
              Create an account
            </button>
          </div>

          <div className="auth-privacy">
            <ShieldCheck size={16} />
            <span>Your personal information is handled securely.</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;