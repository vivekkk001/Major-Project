import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ComplaintForm from "./pages/ComplaintForm";
import MyComplaints from "./pages/MyComplaints";
import Home from "./pages/Home";
import OfficialLogin from "./pages/official/OfficialLogin";
import OfficialDashboard from "./pages/official/OfficialDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import DepartmentManagement from "./pages/admin/DepartmentManagement";

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
            <Route path="/official-login" element={<OfficialLogin />} />
            <Route path="/official-dashboard" element={<OfficialDashboard />} />
            <Route path="/official/dashboard" element={<OfficialDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/departments" element={<DepartmentManagement />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
