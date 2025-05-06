import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ComplaintForm from "./pages/ComplaintForm";
import MyComplaints from "./pages/MyComplaints";
import Home from "./pages/Home";
<<<<<<< Updated upstream
=======
import OfficialLogin from "./pages/OfficialLogin";
import AdminLogin from "./pages/AdminLogin";
import OfficialDashboard from "./pages/OfficialDashboard";
import AdminDashboard from "./pages/AdminDashboard";

>>>>>>> Stashed changes

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/complaints" element={<ComplaintForm />} />
            <Route path="/my-complaints" element={<MyComplaints />} />
<<<<<<< Updated upstream
=======
            <Route path="/official-login" element={<OfficialLogin />} />
            <Route path="/official-dashboard" element={<OfficialDashboard />} />
            <Route path="/official/dashboard" element={<OfficialDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin-login" element={<AdminLogin />} />
>>>>>>> Stashed changes
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
