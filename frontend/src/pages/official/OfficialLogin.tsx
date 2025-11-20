import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Lock, Eye, EyeOff, Shield, User, ShieldCheck } from 'lucide-react';
import axios from 'axios';

interface Department {
  id: number;
  name: string;
}

const OfficialLogin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    department: '',
    official_id: '',
    password: ''
  });
  const [departments, setDepartments] = useState<Department[]>([]);
  const navigate = useNavigate();

  const fallbackDepartments: Department[] = [
    { id: 1, name: 'Parks and Recreation' },
    { id: 2, name: 'Road Maintenance' },
    { id: 3, name: 'Water Supply' },
    { id: 4, name: 'Sanitation' },
    { id: 5, name: 'Sewage' },
    { id: 6, name: 'Public Transportation' },
    { id: 7, name: 'Electrical Department' }
  ];

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/departments`);
        const data = res.data;

        if (Array.isArray(data)) {
          if (typeof data[0] === 'string') {
            setDepartments(data.map((name, idx) => ({ id: idx, name })));
          } else {
            setDepartments(data);
          }
        } else {
          setDepartments(fallbackDepartments);
        }
      } catch (err) {
        console.error('Failed to fetch departments:', err);
        setDepartments(fallbackDepartments);
      }
    };

    fetchDepartments();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/official/login`, {
        official_id: formData.official_id,
        password: formData.password,
        department: formData.department
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("department", formData.department);
      // alert(res.data.message || "Login successful!");
      navigate("/official/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      alert(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

      {/* SmartCivic Logo */}
      <div className="absolute top-6 left-20 flex items-center space-x-2 z-50">
        <div className="flex items-center space-x-2 cursor-default">
          <ShieldCheck className="text-teal-400 h-6 w-6" />
          <span className="text-xl font-bold text-cyan-400">SmartCivic</span>
        </div>
      </div>


      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="blob absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-teal-400/10 to-cyan-400/10 rounded-full morph"></div>
        <div className="blob absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full morph"></div>
      </div>

      {/* Login Card */}
      <div className="relative flex items-center justify-center min-h-screen px-4 py-20">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative mb-4">
              <Building2 className="h-12 w-12 text-orange-400 mx-auto" />
              <div className="absolute inset-0 rounded-full bg-orange-400 opacity-20 blur-lg"></div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Department Access</h2>
            <p className="text-gray-400">Official login for department personnel</p>
          </div>

          {/* Form */}
          <div className="glass rounded-2xl p-8 hover-lift">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Department */}
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-300 mb-2">Department</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="glass-dark w-full pl-10 pr-4 py-3 rounded-lg border border-gray-600 focus:border-orange-400 focus:outline-none transition-colors text-white"
                    required
                    disabled={loading}
                  >
                    <option value="">Select your department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.name} className="bg-slate-800">
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Official ID */}
              <div>
                <label htmlFor="official_id" className="block text-sm font-medium text-gray-300 mb-2">Official ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="official_id"
                    name="official_id"
                    value={formData.official_id}
                    onChange={handleInputChange}
                    className="glass-dark w-full pl-10 pr-4 py-3 rounded-lg border border-gray-600 focus:border-orange-400 focus:outline-none transition-colors text-white placeholder-gray-400"
                    placeholder="Enter your Official ID"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="glass-dark w-full pl-10 pr-12 py-3 rounded-lg border border-gray-600 focus:border-orange-400 focus:outline-none transition-colors text-white placeholder-gray-400"
                    placeholder="Enter your Password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-orange-400 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-orange-400 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full glass py-3 px-4 rounded-lg text-orange-400 hover:bg-orange-400 hover:text-white transition-all hover-lift ripple font-medium border border-orange-400/30 hover:border-orange-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Accessing...' : 'Login'}
              </button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 p-4 glass-dark rounded-lg border border-amber-400/30">
              <div className="flex items-start space-x-2">
                <Shield className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-amber-400 text-sm font-medium">Security Notice</p>
                  <p className="text-gray-300 text-xs mt-1">
                    This is a portal for authorized department personnel only.
                  </p>
                </div>
              </div>
            </div>

            {/* Link to Citizen Login */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-center text-gray-400 text-sm">
                Not a department official?{' '}
                <Link to="/login" className="text-teal-400 hover:text-teal-300 transition-colors font-medium">
                  Citizen Login
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficialLogin;
