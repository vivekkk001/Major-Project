import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, X, Shield, User, FileText,
  BarChart3, LogOut, ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Hide user avatar & dropdown ONLY on forgot/reset password pages
  const hideUserUI =
    location.pathname.startsWith("/forgot-password") ||
    location.pathname.startsWith("/reset-password");

  // Load user on mount or storage change
  useEffect(() => {
    const loadUser = () => {
      const data = localStorage.getItem("user");
      if (data) {
        setUser(JSON.parse(data));
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    loadUser();
    window.addEventListener("authChange", loadUser);
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("authChange", loadUser);
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const clickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/citizen/logout`, {
        method: "POST",
        credentials: "include"
      });
    } catch { }
    localStorage.clear();
    window.dispatchEvent(new Event("authChange"));
    navigate("/home");
  };

  const getUserInitials = (name) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "glass py-4" : "py-6"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-teal-400" />
            <span className="text-xl font-bold gradient-text">SmartCivic</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">

            <Link to="/home" className="text-gray-300 hover:text-teal-400">Home</Link>

            <Link to="/complaint" className="text-gray-300 hover:text-teal-400">File Complaint</Link>

            <Link to="/my-complaints" className="text-gray-300 hover:text-teal-400 flex items-center space-x-1">
              <BarChart3 className="h-4 w-4" /> <span>Track Issues</span>
            </Link>

            {/* User UI Hidden On Forgot/Reset Pages */}
            {!hideUserUI && (
              isAuthenticated ? (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 text-teal-400"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center text-white">
                      {getUserInitials(user?.name || "U")}
                    </div>
                    <span className="hidden lg:block">{user?.name}</span>
                    <ChevronDown className={`h-4 w-4 ${showProfileMenu ? "rotate-180" : ""}`} />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-gray-700 rounded-lg shadow-xl z-50">
                      <div className="py-2">
                        <Link to="/profile" className="block px-4 py-2 hover:bg-slate-700 text-gray-300">
                          Profile
                        </Link>
                        <Link to="/my-complaints" className="block px-4 py-2 hover:bg-slate-700 text-gray-300">
                          My Complaints
                        </Link>
                        <hr className="border-gray-700" />
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-900/20"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-gray-300 hover:text-teal-400">Login</Link>
                  <Link to="/signup" className="glass px-4 py-2 rounded-lg text-teal-400 hover:bg-teal-400 hover:text-white">
                    Sign Up
                  </Link>
                </div>
              )
            )}
          </div>

          {/* Mobile Menu Button — hidden on forgot/reset */}
          {!hideUserUI && (
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden glass p-2 rounded-lg">
              {isOpen ? <X className="h-6 w-6 text-teal-400" /> : <Menu className="h-6 w-6 text-teal-400" />}
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {!hideUserUI && isOpen && (
          <div className="md:hidden glass rounded-lg p-4 space-y-4 mt-4">

            <Link to="/home" onClick={() => setIsOpen(false)} className="block text-gray-300 hover:text-teal-400">
              Home
            </Link>

            <Link to="/complaint" onClick={() => setIsOpen(false)} className="block text-gray-300 hover:text-teal-400">
              File Complaint
            </Link>

            <Link to="/my-complaints" onClick={() => setIsOpen(false)} className="block text-gray-300 hover:text-teal-400">
              Track Issues
            </Link>

            {/* 🔥 Added Profile & My Complaints Here */}
            {isAuthenticated && (
              <>
                <Link to="/profile" onClick={() => setIsOpen(false)} className="block text-gray-300 hover:text-teal-400">
                  Profile
                </Link>

                <Link to="/my-complaints" onClick={() => setIsOpen(false)} className="block text-gray-300 hover:text-teal-400">
                  My Complaints
                </Link>
              </>
            )}

            <hr className="border-gray-700" />

            {isAuthenticated ? (
              <button
                onClick={() => { handleLogout(); setIsOpen(false); }}
                className="block w-full text-left text-red-400 hover:bg-red-900/20 px-4 py-2 rounded"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block text-gray-300 hover:text-teal-400">
                  Login
                </Link>
                <Link to="/signup" onClick={() => setIsOpen(false)} className="block glass px-4 py-2 text-teal-400 rounded">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;
