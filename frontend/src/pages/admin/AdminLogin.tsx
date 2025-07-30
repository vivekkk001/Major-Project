import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('admin@smartcivic.tech');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', {
        email,
        password,
      });

      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('adminName', res.data.name);
      localStorage.setItem('adminEmail', res.data.email);
      localStorage.setItem('adminPhone', res.data.phone);
      localStorage.setItem('adminAddress', res.data.address);

      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 relative">

      {/* Clickable SmartCivic logo */}
      <div
        onClick={() => navigate('/home')}
        className="absolute top-6 left-20 flex items-center space-x-2 z-50 cursor-pointer"
      >
        <ShieldCheck className="text-teal-400 h-6 w-6" />
        <span className="text-xl font-bold text-cyan-400">SmartCivic</span>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="blob absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-teal-400/10 to-cyan-400/10 rounded-full morph"></div>
        <div className="blob absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full morph"></div>
      </div>

      <div className="glass p-8 rounded-xl max-w-md w-full space-y-6 shadow-lg border border-white/10">
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <ShieldCheck className="h-10 w-10 text-teal-400 mx-auto" />
            <div className="absolute inset-0 bg-teal-400 opacity-20 blur-lg rounded-full"></div>
          </div>
          <h1 className="text-3xl font-bold text-white">Admin Login</h1>
          <p className="text-gray-400 text-sm">Access the administrative dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={email}
              disabled
              className="w-full pl-10 pr-4 py-3 bg-white/5 text-white rounded-lg border border-gray-600 placeholder-gray-400 focus:outline-none focus:border-teal-400"
              placeholder="Email"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 text-white rounded-lg border border-gray-600 placeholder-gray-400 focus:outline-none focus:border-teal-400"
              placeholder="Password"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-teal-500/25"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
