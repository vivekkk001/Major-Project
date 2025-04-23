import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/citizen/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/complaints");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required /><br />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required /><br />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
    </div>
  );
};

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/citizen/signup`, { name, email, password });
      navigate("/");
    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required /><br />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required /><br />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required /><br />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

const ComplaintForm = () => {
  
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState({ lat: "", lng: "" });
  const [message, setMessage] = useState("");

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => alert("Location permission is required")
    );
  
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !image || !location.lat || !location.lng) {
      return alert("All fields are required including location");
    }

    const formData = new FormData();
    formData.append("description", description);
    formData.append("image", image);
    formData.append("latitude", location.lat);
    formData.append("longitude", location.lng);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API}/api/complaints`, formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setMessage("Submission failed");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h2>Submit a Complaint</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Describe the issue..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          style={{ marginBottom: "1rem" }}
        />
        <button type="button" onClick={getLocation}>
          📍 Get Location
        </button>
        <p>Lat: {location.lat} | Lng: {location.lng}</p>
        <button type="submit">Submit Complaint</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/api/complaints/my-complaints`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComplaints(res.data);
      } catch (err) {
        console.error("Failed to fetch complaints", err);
      }
    };
    fetchComplaints();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>My Complaints</h2>
      {complaints.length === 0 ? (
        <p>No complaints submitted yet.</p>
      ) : (
        <ul>
          {complaints.map((c) => (
            <li key={c.complaint_id}>
              <strong>{c.department}</strong> - {c.description} <br />
              <em>Status: {c.status}</em>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const App = () => (
  <Router>
    <nav style={{ padding: "1rem", background: "#eee" }}>
      <Link to="/" style={{ marginRight: 10 }}>Login</Link>
      <Link to="/signup" style={{ marginRight: 10 }}>Signup</Link>
      <Link to="/complaints" style={{ marginRight: 10 }}>Submit Complaint</Link>
      <Link to="/my-complaints">My Complaints</Link>
    </nav>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/complaints" element={<ComplaintForm />} />
      <Route path="/my-complaints" element={<MyComplaints />} />
    </Routes>
  </Router>
);

export default App;
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import Home from './pages/Home';
// import MyComplaints from './pages/MyComplaints';
// import './App.css';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/home" element={<Home />} />
//         <Route path="/my-complaints" element={<MyComplaints />} />
//       </Routes>
//     </Router>
//   );
// }
// export default App;
