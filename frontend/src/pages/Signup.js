import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API = "http://localhost:5000";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async e => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/citizen/signup`, formData);
      navigate("/");
    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSignup} className="bg-white shadow-lg rounded p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Signup</h2>
        <input className="input" name="name" type="text" placeholder="Name" onChange={handleChange} required />
        <input className="input mt-4" name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input className="input mt-4" name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button className="btn-primary mt-6 w-full">Register</button>
        <p className="text-sm mt-4 text-center">Already have an account? <Link to="/" className="text-indigo-600 underline">Login</Link></p>
      </form>
    </div>
  );
};

export default Signup;
