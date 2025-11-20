import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Lock, Eye, EyeOff, Shield } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Same password validation as Signup
const validatePassword = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return { isValid: errors.length === 0, errors };
};

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    const validation = validatePassword(value);
    setPasswordErrors(validation.errors);
  };

  const handleReset = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setMessage("");
    setIsError(false);

    // Frontend validation
    const validation = validatePassword(password);
    if (!validation.isValid) {
      setPasswordErrors(validation.errors);
      setMessage("Please fix the password requirements.");
      setIsError(true);
      return;
    }

    if (password !== confirm) {
      setMessage("Passwords do not match");
      setIsError(true);
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API}/api/citizen/reset-password/${token}`, {
        password,
      });

      setIsError(false);
      setMessage("Password Reset Successful. Redirecting to Login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navbar />

      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="blob absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-teal-400/10 to-cyan-400/10 rounded-full"></div>
        <div className="blob absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full"></div>
      </div>

      {/* Main Box */}
      <div className="relative flex items-center justify-center min-h-screen px-4 py-20">
        <div className="w-full max-w-md glass p-8 rounded-2xl hover-lift">
          {/* Header like Signup */}
          <div className="text-center mb-6">
            <div className="relative mb-4">
              <Shield className="h-12 w-12 text-teal-400 mx-auto" />
              <div className="absolute inset-0 rounded-full bg-teal-400 opacity-20 blur-lg"></div>
            </div>
            <h2 className="text-3xl font-bold mb-1">Reset Password</h2>
            <p className="text-gray-400 text-sm">
              Set a new password for your SmartCivic account
            </p>
          </div>

          {/* Status Message */}
          {message && (
            <p
              className={`mb-4 p-3 rounded-lg text-center glass border ${isError ? "border-red-400/40 text-red-300" : "border-teal-400/30 text-teal-300"
                }`}
            >
              {message}
            </p>
          )}

          {/* Form */}
          <form onSubmit={handleReset} className="space-y-6">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="glass-dark w-full pl-10 pr-12 py-3 rounded-lg border border-gray-600 focus:border-teal-400 focus:outline-none transition-colors text-white placeholder-gray-400"
                  placeholder="Enter new password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-teal-400 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-teal-400 transition-colors" />
                  )}
                </button>
              </div>

              {/* Password Errors */}
              {passwordErrors.length > 0 && (
                <div className="mt-2 space-y-1">
                  {passwordErrors.map((err, idx) => (
                    <p key={idx} className="text-sm text-red-400">
                      • {err}
                    </p>
                  ))}
                </div>
              )}
              <div className="mt-2 text-xs text-gray-500">
                Password must contain: 8+ characters, uppercase, lowercase, number, and special character.
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirm ? "text" : "password"}
                  className="glass-dark w-full pl-10 pr-12 py-3 rounded-lg border border-gray-600 focus:border-teal-400 focus:outline-none transition-colors text-white placeholder-gray-400"
                  placeholder="Re-enter new password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirm ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-teal-400 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-teal-400 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                loading ||
                password.length === 0 ||
                confirm.length === 0 ||
                passwordErrors.length > 0
              }
              className="w-full glass glow py-3 px-4 rounded-lg text-teal-400 hover:bg-teal-400 hover:text-white transition-all hover-lift disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 pt-6 border-t border-gray-700 text-center">
            <p className="text-gray-400 text-sm">
              Back to{" "}
              <Link to="/login" className="text-teal-400 hover:text-teal-300">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .glass {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(10px);
          border:1px solid rgba(255,255,255,0.1);
        }
        .glass-dark {
          background: rgba(0,0,0,0.2);
          backdrop-filter: blur(10px);
          border:1px solid rgba(255,255,255,0.1);
        }
        .hover-lift:hover {
          transform: translateY(-2px);
        }
        .glow:hover { 
          box-shadow: 0 0 30px rgba(20,184,166,0.2); 
        }
        .blob { 
          animation: morph 8s infinite; 
        }
        @keyframes morph {
          0%,100%{ border-radius:60% 40% 30% 70%/60% 30% 70% 40%; }
          50% { border-radius:30% 60% 70% 40%/50% 60% 30% 60%; }
        }
      `}</style>
    </div>
  );
};

export default ResetPassword;
