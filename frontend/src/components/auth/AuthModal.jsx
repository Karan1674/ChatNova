import React, { useState, useEffect } from "react";
import { Sparkles, X, Mail, Lock, User, ArrowRight, Eye, EyeOff,} from "lucide-react";
import { useToast } from "../toast/ToastContext";
import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "../../store/slices/authSlice";
import "./Auth.css";

export default function AuthModal({ initialMode = "login", isOpen, onClose, onAuthSuccess}) {
  const toast = useToast();
  const dispatch = useDispatch();
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInstantDemoLoading, setIsInstantDemoLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow || "unset";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please provide both email and password.");
      return;
    }

    if (mode === "signup") {
      if (!formData.firstName.trim()) {
        toast.error("First name is required.");
        return;
      }
      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters long.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
    }

    setIsLoading(true);

    try {
      let result;
      if (mode === "signup") {
        result = await dispatch(
          registerUser({
            fullName: {
              firstName: formData.firstName.trim(),
              lastName: formData.lastName.trim(),
            },
            email: formData.email.trim(),
            password: formData.password,
          }),
        ).unwrap();
      } else {
        result = await dispatch(
          loginUser({
            email: formData.email.trim(),
            password: formData.password,
          }),
        ).unwrap();
      }

      toast.success(
        result?.message ||
          (mode === "signup"
            ? "Account created successfully!"
            : "Welcome back!"),
      );

      if (onAuthSuccess) {
        onAuthSuccess(result.user);
      }

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Authentication error:", err);
      toast.error(
        typeof err === "string"
          ? err
          : "Authentication failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    try {
      setIsInstantDemoLoading(true);

      const result = await dispatch(
        loginUser({
          email: "demo@example.com",
          password: "123456",
        }),
      ).unwrap();

      toast.success("Welcome! Logged in with Demo Account.");

      if (onAuthSuccess) {
        onAuthSuccess(result.user);
      }
    } catch (err) {
      console.error("Demo login error:", err);
      toast.error(
        typeof err === "string" ? err : "Demo login failed. Please try again.",
      );
    } finally {
      setIsInstantDemoLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!formData.email.trim()) {
      toast.info(
        "Enter your email address above, then click 'Forgot password?'.",
      );
    } else {
      toast.info(`Password reset link sent to ${formData.email}!`);
    }
  };

  return (
    <div className="auth-overlay-backdrop" onClick={onClose}>
      <div
        className="auth-modal-card glass-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="auth-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="auth-modal-header">
          <div className="auth-brand-pill">
            <div className="brand-icon-box small">
              <Sparkles size={16} />
            </div>
            <span className="brand-name small">
              Chat<span className="brand-accent">Nova</span>
            </span>
          </div>

          <h2 className="auth-title">
            {mode === "signup" ? "Create Your Account" : "Welcome Back"}
          </h2>
          <p className="auth-subtitle">
            {mode === "signup"
              ? "Access real-time streaming AI and persistent neural memory."
              : "Enter your credentials to resume your workspace sessions."}
          </p>
        </div>

        <div className="auth-tabs-row">
          <button
            type="button"
            className={`auth-tab-btn ${mode === "login" ? "active" : ""}`}
            onClick={() => setMode("login")}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${mode === "signup" ? "active" : ""}`}
            onClick={() => setMode("signup")}
          >
            Create Account
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="form-row-two-col">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <div className="input-with-icon">
                  <User size={16} className="field-icon" />
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Alex"
                    value={formData.firstName}
                    onChange={handleChange}
                    required={mode === "signup"}
                    className="auth-text-input"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Mercer"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="auth-text-input no-left-icon"
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail size={16} className="field-icon" />
              <input
                type="email"
                name="email"
                placeholder="alex@company.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="auth-text-input"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="label-with-aside">
              <label className="form-label">Password</label>
              {mode === "login" && (
                <button
                  type="button"
                  className="forgot-link"
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="input-with-icon">
              <Lock size={16} className="field-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="auth-text-input"
              />

              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {mode === "signup" && (
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-with-icon">
                <Lock size={16} className="field-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required={mode === "signup"}
                  className="auth-text-input"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="glow-btn auth-submit-btn"
            disabled={isLoading || isInstantDemoLoading}
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                <span>
                  {mode === "signup"
                    ? "Create Free Account"
                    : "Sign In to ChatNova"}
                </span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR CONTINUE WITH</span>
        </div>

        <div className="social-auth-grid">
          <button
            type="button"
            className="social-auth-btn"
            onClick={handleQuickDemo}
            disabled={isInstantDemoLoading}
          >
            {isInstantDemoLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                <Sparkles size={16} className="social-icon-sparkle" />
                <span>Instant Demo Account</span>
              </>
            )}
          </button>
        </div>

        <div className="auth-modal-footer">
          <p>
            By continuing, you agree to ChatNova's{" "}
            <span className="footer-highlight">Terms of Service</span> and{" "}
            <span className="footer-highlight">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
