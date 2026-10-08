import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, verifyOtp, resendOtp } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "./css/Auth.css";

const STORAGE_KEY = "oj:signup-verify";
const MAX_AGE_MS = 30 * 60 * 1000; 
const EMPTY_FORM = { firstName: "", lastName: "", email: "", password: "" };

function loadVerification() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    if (saved?.id && saved?.maskedEmail && Date.now() - saved.createdAt < MAX_AGE_MS) {
      return saved;
    }
  } catch {
    // ignore
  }
  clearVerification();
  return null;
}

function saveVerification(value) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // ignore (private mode): the page still works, it just can't resume after a refresh
  }
}

function clearVerification() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

const secondsUntil = (time) => Math.max(0, Math.ceil((time - Date.now()) / 1000));

export default function Register() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [verification, setVerification] = useState(loadVerification);
  const [cooldown, setCooldown] = useState(() =>
    verification ? secondsUntil(verification.resendAt) : 0,
  );
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const backToForm = (errorMessage = "") => {
    clearVerification();
    setVerification(null);
    setOtp("");
    setMessage("");
    setError(errorMessage);
  };

  const isDead = (err) =>
    ["VERIFICATION_EXPIRED", "EMAIL_UNDELIVERABLE", "EMAIL_EXISTS"].includes(
      err.code,
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const data = await registerUser(formData);
      const wait = data.resendAfter ?? 60;
      const next = {
        id: data.verificationId,
        maskedEmail: data.maskedEmail,
        createdAt: Date.now(),
        resendAt: Date.now() + wait * 1000,
      };
      saveVerification(next);
      setVerification(next);
      setCooldown(wait);
      setOtp("");
      setFormData((f) => ({ ...f, email: "", password: "" }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const data = await verifyOtp(verification.id, otp);
      clearVerification();
      setUser(data.user);
      navigate("/problems", { replace: true });
    } catch (err) {
      if (isDead(err)) backToForm(err.message);
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setMessage("");
    setError("");
    try {
      await resendOtp(verification.id);
      const next = { ...verification, resendAt: Date.now() + 60 * 1000 };
      saveVerification(next);
      setVerification(next);
      setCooldown(60);
      setOtp("");
      setMessage("A new code has been sent.");
    } catch (err) {
      if (isDead(err)) backToForm(err.message);
      else {
        if (err.retryAfter) setCooldown(err.retryAfter);
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (verification) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="logo">{"</>"}</div>
          <h1>Verify your email</h1>
          <p>
            Enter the 6-digit code we sent to{" "}
            <strong>{verification.maskedEmail}</strong>
          </p>
          <form onSubmit={handleVerify}>
            <input
              className="otp-input"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="······"
              value={otp}
              autoFocus
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />
            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}
            <button type="submit" disabled={loading || otp.length !== 6}>
              {loading ? "Verifying..." : "Verify & Create Account"}
            </button>
          </form>
          <div className="otp-actions">
            <button
              type="button"
              className="link-btn"
              onClick={handleResend}
              disabled={loading || cooldown > 0}
            >
              {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
            </button>
            <button
              type="button"
              className="link-btn"
              onClick={() => backToForm()}
            >
              Use a different email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="logo">{"</>"}</div>
        <h1>Create Account</h1>
        <p>Join the platform today</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "Sending code..." : "Register"}
          </button>
        </form>
        <div className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
