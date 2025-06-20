import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ComplaintForm from './pages/ComplaintForm';
import MyComplaints from './pages/MyComplaints';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import DepartmentManagement from './pages/admin/DepartmentManagement';
import UserManagement from './pages/admin/UserManagement';
import AdminLogin from './pages/admin/AdminLogin';

// Official Pages
import OfficialDashboard from './pages/official/OfficialDashboard';
import OfficialLogin from './pages/official/OfficialLogin';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/complaint" element={<ComplaintForm />} />
          <Route path="/my-complaints" element={<MyComplaints />} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/departments" element={<DepartmentManagement />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Official */}
          <Route path="/official/dashboard" element={<OfficialDashboard />} />
          <Route path="/official/login" element={<OfficialLogin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
