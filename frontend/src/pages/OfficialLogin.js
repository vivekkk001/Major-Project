import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OfficialLogin = () => {
  const [official_id, setOfficialId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/api/official/login',
        { official_id, password },
        { withCredentials: true }
      );

      localStorage.setItem('token', res.data.token);

      if (res.data.role === 'official') navigate('/official-dashboard');
      else if (res.data.role === 'admin') navigate('/admin');
      else alert('You are not authorized as an official or admin.');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Official Login</h2>
      <input
        className="w-full mb-3 p-2 border"
        placeholder="Official ID"
        value={official_id}
        onChange={(e) => setOfficialId(e.target.value)}
      />
      <input
        className="w-full mb-3 p-2 border"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
        Login
      </button>
    </form>
  );
};

export default OfficialLogin;
