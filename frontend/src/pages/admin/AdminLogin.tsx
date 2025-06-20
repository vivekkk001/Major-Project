import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('admin@smartcivic.com');
  const [password, setPassword] = useState('admin123');
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
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
            Login as Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
