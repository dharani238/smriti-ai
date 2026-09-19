import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  HeartHandshake,
  LockKeyhole,
  Mail,
  ShieldCheck,
  User,
  UserRound,
  UsersRound,
  BadgeCheck,
} from "lucide-react";
import { register } from "../services/api";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [patientId, setPatientId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in your name, email address and password.");
      return;
    }

    if (role === "patient" && !patientId.trim()) {
      setError("Please enter the Patient ID provided by your caregiver.");
      return;
    }

    try {
      setLoading(true);

      const data = await register({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        patientId:
          role === "patient" ? patientId.trim() : undefined,
      });

      if (!data.success) {
        setError(data.message || "Registration failed. Please try again.");
        return;
      }

      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);

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
      handleRegister();
    }
  };

  return (
    <main className="register-page">
      <section className="register-introduction">
        <div className="register-introduction-inner">

          <div className="register-brand">
            <div className="register-brand-mark" aria-hidden="true">
              S
            </div>

            <span className="register-brand-name">
              SMRITI
            </span>
          </div>

          <div className="register-message">
            <p className="register-eyebrow">
              MEMORY & DAILY WELLBEING
            </p>

            <h1>
              Care that feels
              <br />
              familiar.
            </h1>

            <p className="register-description">
              Create a secure space where personal memories,
              daily routines and meaningful activities stay
              connected with family support.
            </p>
          </div>

          <div className="register-benefits">

            <div className="register-benefit">
              <HeartHandshake
                size={22}
                strokeWidth={1.8}
              />

              <div>
                <strong>
                  Personal by design
                </strong>

                <span>
                  Built around familiar people and memories
                </span>
              </div>
            </div>

            <div className="register-benefit">
              <ShieldCheck
                size={22}
                strokeWidth={1.8}
              />

              <div>
                <strong>
                  Family supported
                </strong>

                <span>
                  Caregivers stay connected to daily activity
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="register-form-section">

        <div className="register-form-wrapper">

          <button
            type="button"
            className="register-back"
            onClick={() => navigate("/login")}
          >
            <ArrowLeft size={18} />
            Back to sign in
          </button>

          <div className="register-mobile-brand">
            <div className="register-brand-mark">
              S
            </div>

            <span className="register-brand-name">
              SMRITI
            </span>
          </div>

          <div className="register-heading">

            <p className="register-small-label">
              GET STARTED
            </p>

            <h2>
              Create your account
            </h2>

            <p>
              Choose how you'll use SMRITI, then enter
              your account details.
            </p>

          </div>

          {error && (
            <div
              className="register-error"
              role="alert"
            >
              {error}
            </div>
          )}

          <div className="role-section">

            <label className="role-heading">
              I am using SMRITI as
            </label>

            <div className="role-options">

              <button
                type="button"
                className={`role-card ${
                  role === "patient"
                    ? "role-card-active"
                    : ""
                }`}
                onClick={() => setRole("patient")}
              >

                <div className="role-icon">
                  <UserRound size={22} />
                </div>

                <div>
                  <strong>Patient</strong>

                  <span>
                    Use memories, activities and routines
                  </span>
                </div>

                {role === "patient" && (
                  <BadgeCheck
                    className="role-check"
                    size={20}
                  />
                )}

              </button>

              <button
                type="button"
                className={`role-card ${
                  role === "caregiver"
                    ? "role-card-active"
                    : ""
                }`}
                onClick={() => {
                  setRole("caregiver");
                  setPatientId("");
                }}
              >

                <div className="role-icon">
                  <UsersRound size={22} />
                </div>

                <div>
                  <strong>
                    Caregiver
                  </strong>

                  <span>
                    Support and manage a loved one's experience
                  </span>
                </div>

                {role === "caregiver" && (
                  <BadgeCheck
                    className="role-check"
                    size={20}
                  />
                )}

              </button>

            </div>
          </div>

          <div className="register-fields">

            <div className="register-field">

              <label htmlFor="name">
                Full name
              </label>

              <div className="register-input-wrapper">

                <User size={20} />

                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                />

              </div>
            </div>

            <div className="register-field">

              <label htmlFor="register-email">
                Email address
              </label>

              <div className="register-input-wrapper">

                <Mail size={20} />

                <input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                />

              </div>
            </div>

            <div className="register-field">

              <label htmlFor="register-password">
                Password
              </label>

              <div className="register-input-wrapper">

                <LockKeyhole size={20} />

                <input
                  id="register-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
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

            {role === "patient" && (

              <div className="register-field">

                <label htmlFor="patient-id">
                  Patient ID
                </label>

                <div className="register-input-wrapper">

                  <BadgeCheck size={20} />

                  <input
                    id="patient-id"
                    type="text"
                    placeholder="Enter your Patient ID"
                    value={patientId}
                    onChange={(e) =>
                      setPatientId(e.target.value)
                    }
                    onKeyDown={handleKeyDown}
                  />

                </div>

                <p className="patient-id-help">
                  Enter the Patient ID provided by your caregiver.
                </p>

              </div>
            )}

          </div>

          <button
            type="button"
            className="register-submit"
            onClick={handleRegister}
            disabled={loading}
          >

            <span>
              {loading
                ? "Creating account..."
                : "Create account"}
            </span>

            {!loading && (
              <ArrowRight size={20} />
            )}

          </button>

          <div className="register-signin">

            <span>
              Already have an account?
            </span>

            <button
              type="button"
              onClick={() =>
                navigate("/login")
              }
            >
              Sign in
            </button>

          </div>

        </div>
      </section>
    </main>
  );
}

export default Register;