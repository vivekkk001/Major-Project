import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OfficialLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Call backend
    const res = await fetch('/api/official/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      navigate('/official-dashboard');
    } else {
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin} className="p-6 max-w-md mx-auto bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Official Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-2 w-full p-2 border rounded" />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-4 w-full p-2 border rounded" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
    </form>
  );
};

export default OfficialLogin;
