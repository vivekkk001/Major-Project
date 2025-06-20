import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Shield, User, FileText, Settings, BarChart3 } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'glass py-4' : 'py-6'
    }`}>
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
            <Link to="/" className="text-gray-300 hover:text-teal-400 transition-colors hover-lift">
              Home
            </Link>
            <Link to="/complaint" className="text-gray-300 hover:text-teal-400 transition-colors hover-lift">
              File Complaint
            </Link>
            <Link to="/my-complaints" className="text-gray-300 hover:text-teal-400 transition-colors hover-lift flex items-center space-x-1">
              <BarChart3 className="h-4 w-4" />
              <span>Track Issues</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-gray-300 hover:text-teal-400 transition-colors flex items-center space-x-1"
              >
                <User className="h-4 w-4" />
                <span>Login</span>
              </Link>
              <Link 
                to="/signup" 
                className="glass px-4 py-2 rounded-lg text-teal-400 hover:bg-teal-400 hover:text-white transition-all ripple"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden glass p-2 rounded-lg"
          >
            {isOpen ? <X className="h-6 w-6 text-teal-400" /> : <Menu className="h-6 w-6 text-teal-400" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ${
          isOpen ? 'max-h-screen opacity-100 mt-4' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="glass rounded-lg p-4 space-y-4">
            <Link 
              to="/" 
              className="block text-gray-300 hover:text-teal-400 transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/complaint" 
              className="block text-gray-300 hover:text-teal-400 transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              File Complaint
            </Link>
            <Link 
              to="/my-complaints" 
              className="block text-gray-300 hover:text-teal-400 transition-colors py-2 flex items-center space-x-1"
              onClick={() => setIsOpen(false)}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Track Issues</span>
            </Link>
            <hr className="border-gray-700" />
            <Link 
              to="/login" 
              className="block text-gray-300 hover:text-teal-400 transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="block glass-dark px-4 py-2 rounded-lg text-teal-400 hover:bg-teal-400 hover:text-white transition-all text-center"
              onClick={() => setIsOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;