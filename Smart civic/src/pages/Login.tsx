import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/citizen/login', formData, {
        withCredentials: true
      });

      alert(res.data.message || 'Login successful!');
      navigate('/complaint');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      alert(msg);
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="blob absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-teal-400/10 to-cyan-400/10 rounded-full morph"></div>
        <div className="blob absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full morph"></div>
      </div>

      <div className="relative flex items-center justify-center min-h-screen px-4 py-20">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative mb-4">
              <Shield className="h-12 w-12 text-teal-400 mx-auto" />
              <div className="absolute inset-0 rounded-full bg-teal-400 opacity-20 blur-lg"></div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400">Sign in to your SmartCivic account</p>
          </div>

          {/* Login Form */}
          <div className="glass rounded-2xl p-8 hover-lift">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="glass-dark w-full pl-10 pr-4 py-3 rounded-lg border border-gray-600 focus:border-teal-400 focus:outline-none transition-colors text-white placeholder-gray-400"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="glass-dark w-full pl-10 pr-12 py-3 rounded-lg border border-gray-600 focus:border-teal-400 focus:outline-none transition-colors text-white placeholder-gray-400"
                    placeholder="Enter your password"
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
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 text-teal-400 focus:ring-teal-400 border-gray-600 rounded bg-transparent"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-300">
                    Remember me
                  </label>
                </div>
                <Link to="/forgot-password" className="text-sm text-teal-400 hover:text-teal-300 transition-colors">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full glass glow py-3 px-4 rounded-lg text-teal-400 hover:bg-teal-400 hover:text-white transition-all hover-lift ripple font-medium"
              >
                Sign In
              </button>
            </form>

            {/* Divider */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-center text-gray-400 text-sm">
                Don't have an account?{' '}
                <Link to="/signup" className="text-teal-400 hover:text-teal-300 transition-colors font-medium">
                  Sign Up
                </Link>
              </p>
            </div>

            {/* Official Links */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-center text-gray-500 text-xs mb-2">Official Access</p>
              <div className="flex justify-center space-x-4">
                <Link to="/official/login" className="text-xs text-teal-400 hover:text-teal-300 transition-colors">
                  Department Login
                </Link>
                <Link to="/admin/dashboard" className="text-xs text-teal-400 hover:text-teal-300 transition-colors">
                  Admin Access
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
