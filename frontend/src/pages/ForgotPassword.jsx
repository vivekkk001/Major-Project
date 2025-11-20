import React, { useState } from "react";
import axios from "axios";
import { Mail, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await axios.post(`${API}/api/citizen/forgot-password`, { email });
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="blob absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-teal-400/10 to-cyan-400/10 rounded-full"></div>
        <div className="blob absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full"></div>
      </div>

      <div className="relative flex items-center justify-center min-h-screen px-4 py-20">
        <div className="w-full max-w-md">

          <div className="text-center mb-8">
            <div className="relative mb-4">
              <Shield className="h-12 w-12 text-teal-400 mx-auto" />
              <div className="absolute inset-0 rounded-full bg-teal-400 opacity-20 blur-lg"></div>
            </div>
            <h2 className="text-3xl font-bold text-white">Forgot Password</h2>
            <p className="text-gray-400 mt-1">Reset your SmartCivic password</p>
          </div>

          <div className="glass rounded-2xl p-8">
            {msg && (
              <div className="mb-4 p-3 rounded-lg text-center text-teal-300 glass border border-teal-400/30">
                {msg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Email Field */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    className="glass-dark w-full pl-10 pr-4 py-3 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-teal-400 focus:outline-none"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full glass glow py-3 px-4 rounded-lg text-teal-400 hover:bg-teal-400 hover:text-white transition-all hover-lift disabled:opacity-50"
              >
                {loading ? "Sending Link..." : "Send Reset Link"}
              </button>
            </form>

            {/* Login Redirect */}
            <div className="mt-6 pt-6 border-t border-gray-700 text-center">
              <p className="text-gray-400 text-sm">
                Remembered your password?{" "}
                <Link to="/login" className="text-teal-400 hover:text-teal-300 font-medium">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .glass { background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); border:1px solid rgba(255,255,255,0.1); }
        .glass-dark { background: rgba(0,0,0,0.2); backdrop-filter: blur(10px); border:1px solid rgba(255,255,255,0.1); }
        .glow:hover { box-shadow: 0 0 30px rgba(20,184,166,0.2); }
        .blob { animation: morph 8s infinite; }
        @keyframes morph { 0%,100%{ border-radius:60% 40% 30% 70%/60% 30% 70% 40%; } 50% { border-radius:30% 60% 70% 40%/50% 60% 30% 60%; } }
      `}</style>
    </div>
  );
}
