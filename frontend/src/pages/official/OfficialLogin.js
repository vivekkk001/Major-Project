import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OfficialLogin = () => {
  const [official_id, setOfficialId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/official/login", {
        official_id,
        password
      });
      alert(res.data.message);
      navigate("/official-dashboard");
    } catch (err) {
      alert("Login failed");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleLogin} className="bg-white p-8 shadow-md rounded">
        <h2 className="text-xl font-bold mb-4">Official Login</h2>
        <input
          type="text"
          placeholder="Official ID"
          value={official_id}
          onChange={(e) => setOfficialId(e.target.value)}
          className="block mb-4 w-full border p-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block mb-4 w-full border p-2"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default OfficialLogin;
