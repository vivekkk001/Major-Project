import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu, X, Shield, User, FileText, Settings,
  BarChart3, LogOut, Bell, ChevronDown
} from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState<any>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/citizen/me`, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setUser(null);
      }
    };

    fetchUser();
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    setShowProfileMenu(false);
    setUser(null);
    navigate('/home');
    window.location.reload();
  };

  const getUserInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass py-4' : 'py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Shield className="h-8 w-8 text-teal-400 group-hover:text-teal-300 transition-colors" />
              <div className="absolute inset-0 rounded-full bg-teal-400 opacity-20 blur-lg group-hover:opacity-30 transition-opacity"></div>
            </div>
            <span className="text-xl font-bold gradient-text">SmartCivic</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-teal-400 transition-colors">Home</Link>
            <Link to="/complaint" className="text-gray-300 hover:text-teal-400 transition-colors">File Complaint</Link>
            <Link to="/my-complaints" className="text-gray-300 hover:text-teal-400 transition-colors flex items-center space-x-1">
              <BarChart3 className="h-4 w-4" />
              <span>Track Issues</span>
            </Link>

            {token && user ? (
              <div className="flex items-center space-x-4">
                <button className="relative p-2 text-gray-400 hover:text-teal-400 transition-colors">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 text-teal-400 hover:text-white transition-colors group"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                      {getUserInitials(user.name)}
                    </div>
                    <span className="hidden lg:block">{user.name}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-md border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                      <div className="p-4 bg-gradient-to-r from-teal-400/10 to-blue-500/10 border-b border-gray-700">
                        <div className="flex items-center space-x-3">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                            {getUserInitials(user.name)}
                          </div>
                          <div>
                            <div className="text-white font-medium">{user.name}</div>
                            <div className="text-gray-400 text-sm">{user.email}</div>
                          </div>
                        </div>
                      </div>

                      <div className="py-2">
                        <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors" onClick={() => setShowProfileMenu(false)}>
                          <User className="h-4 w-4 mr-3" /> View Profile
                        </Link>
                        <Link to="/my-complaints" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors" onClick={() => setShowProfileMenu(false)}>
                          <FileText className="h-4 w-4 mr-3" /> My Complaints
                        </Link>
                        <Link to="/settings" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors" onClick={() => setShowProfileMenu(false)}>
                          <Settings className="h-4 w-4 mr-3" /> Settings
                        </Link>
                        <hr className="my-2 border-gray-700" />
                        <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 transition-colors">
                          <LogOut className="h-4 w-4 mr-3" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-300 hover:text-teal-400 transition-colors flex items-center space-x-1">
                  <User className="h-4 w-4" /><span>Login</span>
                </Link>
                <Link to="/signup" className="glass px-4 py-2 rounded-lg text-teal-400 hover:bg-teal-400 hover:text-white transition-all ripple">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden glass p-2 rounded-lg">
            {isOpen ? <X className="h-6 w-6 text-teal-400" /> : <Menu className="h-6 w-6 text-teal-400" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ${isOpen ? 'max-h-screen opacity-100 mt-4' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="glass rounded-lg p-4 space-y-4">
            <Link to="/" className="block text-gray-300 hover:text-teal-400 transition-colors py-2" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/complaint" className="block text-gray-300 hover:text-teal-400 transition-colors py-2" onClick={() => setIsOpen(false)}>File Complaint</Link>
            <Link to="/my-complaints" className="block text-gray-300 hover:text-teal-400 transition-colors py-2" onClick={() => setIsOpen(false)}>Track Issues</Link>
            <hr className="border-gray-700" />

            {token && user ? (
              <>
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-teal-400/10 to-blue-500/10 rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                    {getUserInitials(user.name)}
                  </div>
                  <div>
                    <div className="text-white font-medium">{user.name}</div>
                    <div className="text-gray-400 text-sm">{user.email}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link to="/profile" className="block text-gray-300 hover:text-teal-400 transition-colors py-2" onClick={() => setIsOpen(false)}>View Profile</Link>
                  <Link to="/settings" className="block text-gray-300 hover:text-teal-400 transition-colors py-2" onClick={() => setIsOpen(false)}>Settings</Link>
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block text-red-400 hover:bg-red-900/20 px-4 py-2 rounded transition-colors">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-300 hover:text-teal-400 transition-colors py-2" onClick={() => setIsOpen(false)}>Login</Link>
                <Link to="/signup" className="block glass-dark px-4 py-2 rounded-lg text-teal-400 hover:bg-teal-400 hover:text-white transition-all text-center" onClick={() => setIsOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
