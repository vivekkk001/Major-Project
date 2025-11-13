import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone, Shield, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';

// Type for form state
interface SignupFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  rememberMe: boolean;
}

// Environment variable for backend URL
const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Password validation function
const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Phone validation function
const validatePhone = (phone: string): boolean => {
  // Remove +91 if present and check if remaining is 10 digits
  const cleanPhone = phone.replace(/^\+91/, '');
  return /^\d{10}$/.test(cleanPhone);
};

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [phoneError, setPhoneError] = useState<string>('');

  const [formData, setFormData] = useState<SignupFormData>({
    fullName: '',
    email: '',
    phone: '+91', // Default +91 prefix
    password: '',
    address: '',
    confirmPassword: '',
    agreeToTerms: false,
    rememberMe: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    
    if (name === 'phone') {
      // Ensure +91 prefix is always present
      let phoneValue = value;
      if (!phoneValue.startsWith('+91')) {
        phoneValue = '+91' + phoneValue.replace(/^\+91/, '');
      }
      setFormData({
        ...formData,
        [name]: phoneValue
      });
      
      // Validate phone number
      if (!validatePhone(phoneValue)) {
        setPhoneError('Phone number must be 10 digits after +91');
      } else {
        setPhoneError('');
      }
    } else if (name === 'password') {
      setFormData({
        ...formData,
        [name]: value
      });
      
      // Validate password
      const validation = validatePassword(value);
      setPasswordErrors(validation.errors);
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final validations
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      alert('Please fix password requirements: ' + passwordValidation.errors.join(', '));
      return;
    }

    if (!validatePhone(formData.phone)) {
      alert('Please enter a valid phone number');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      await axios.post(`${API}/api/citizen/signup`, {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: formData.password,
        rememberMe: formData.rememberMe
      }, {
        withCredentials: true
      });

      alert('Signup successful!');
      navigate('/login');

      setFormData({
        fullName: '',
        email: '',
        phone: '+91',
        password: '',
        address: '',
        confirmPassword: '',
        agreeToTerms: false,
        rememberMe: false
      });
    } catch (error: any) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || 'Signup failed';
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="blob absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-teal-400/10 to-cyan-400/10 rounded-full morph"></div>
        <div className="blob absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full morph"></div>
      </div>

      <div className="relative flex items-center justify-center min-h-screen px-4 py-20">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative mb-4">
              <Shield className="h-12 w-12 text-teal-400 mx-auto" />
              <div className="absolute inset-0 rounded-full bg-teal-400 opacity-20 blur-lg"></div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Join SmartCivic</h2>
            <p className="text-gray-400">Create your account to get started</p>
          </div>

          {/* Signup Form */}
          <div className="glass rounded-2xl p-8 hover-lift">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Full Name */}
              <InputField
                label="Full Name"
                icon={<User className="h-5 w-5 text-gray-400" />}
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />

              {/* Email */}
              <InputField
                label="Email Address"
                icon={<Mail className="h-5 w-5 text-gray-400" />}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />

              {/* Phone */}
              <div>
                <InputField
                  label="Phone Number"
                  icon={<Phone className="h-5 w-5 text-gray-400" />}
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91XXXXXXXXXX"
                />
                {phoneError && (
                  <p className="mt-1 text-sm text-red-400">{phoneError}</p>
                )}
              </div>

              {/* Address */}
              <InputField
                label="Address"
                icon={<MapPin className="h-5 w-5 text-gray-400" />}
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your address"
              />

              {/* Password */}
              <div>
                <InputField
                  label="Password"
                  icon={<Lock className="h-5 w-5 text-gray-400" />}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  toggleEye={() => setShowPassword(!showPassword)}
                  showEye={showPassword}
                />
                {passwordErrors.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {passwordErrors.map((error, index) => (
                      <p key={index} className="text-sm text-red-400">• {error}</p>
                    ))}
                  </div>
                )}
                <div className="mt-2 text-xs text-gray-500">
                  Password must contain: 8+ characters, uppercase, lowercase, number, and special character
                </div>
              </div>

              {/* Confirm Password */}
              <InputField
                label="Confirm Password"
                icon={<Lock className="h-5 w-5 text-gray-400" />}
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                toggleEye={() => setShowConfirmPassword(!showConfirmPassword)}
                showEye={showConfirmPassword}
              />

              {/* Remember Me */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-teal-400 focus:ring-teal-400 border-gray-600 rounded bg-transparent"
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-300">
                  Remember Me
                </label>
              </div>

              {/* Terms */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-teal-400 focus:ring-teal-400 border-gray-600 rounded bg-transparent"
                  required
                />
                <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-300">
                  I agree to the{' '}
                  <Link to="/terms-of-service" className="text-teal-400 hover:text-teal-300 transition-colors">Terms</Link>{' '}
                  and{' '}
                  <Link to="/privacy-policy" className="text-teal-400 hover:text-teal-300 transition-colors">Privacy Policy</Link>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!formData.agreeToTerms || passwordErrors.length > 0 || phoneError !== ''}
                className="w-full glass glow py-3 px-4 rounded-lg text-teal-400 hover:bg-teal-400 hover:text-white transition-all hover-lift ripple font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Account
              </button>
            </form>

            {/* Divider */}
            <div className="mt-6 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-teal-400 hover:text-teal-300 transition-colors font-medium">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 🔹 Reusable InputField component
interface InputProps {
  label: string;
  icon: React.ReactNode;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  toggleEye?: () => void;
  showEye?: boolean;
}

const InputField: React.FC<InputProps> = ({
  label, icon, name, type = 'text', value, onChange, placeholder, toggleEye, showEye
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="glass-dark w-full pl-10 pr-12 py-3 rounded-lg border border-gray-600 focus:border-teal-400 focus:outline-none transition-colors text-white placeholder-gray-400"
        placeholder={placeholder}
        required
      />
      {toggleEye && (
        <button
          type="button"
          onClick={toggleEye}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          {showEye ? (
            <EyeOff className="h-5 w-5 text-gray-400 hover:text-teal-400 transition-colors" />
          ) : (
            <Eye className="h-5 w-5 text-gray-400 hover:text-teal-400 transition-colors" />
          )}
        </button>
      )}
    </div>
  </div>
);

export default Signup;