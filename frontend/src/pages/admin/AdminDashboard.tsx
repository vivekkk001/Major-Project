import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, LogOut, ShieldCheck } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/home');
    window.location.reload();
  };

  // Generate floating particles (same as home page)
  const particles = Array.from({ length: 50 }, (_, i) => (
    <div
      key={i}
      className="particle"
      style={{
        left: `${Math.random() * 100}%`,
        width: `${Math.random() * 4 + 2}px`,
        height: `${Math.random() * 4 + 2}px`,
        animationDelay: `${Math.random() * 15}s`,
        animationDuration: `${Math.random() * 10 + 10}s`
      }}
    />
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Animated Background - Same as Home Page */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {particles}
        <div className="blob absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-teal-400/20 to-cyan-400/20 rounded-full morph"></div>
        <div className="blob absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full morph"></div>
        <div className="blob absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-teal-400/5 to-cyan-400/5 rounded-full morph"></div>
      </div>

      {/* Top Bar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-slate-900/60 backdrop-blur-md border-b border-slate-700 px-6 py-4 flex items-center justify-between">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate('/home')}
        >
          <ShieldCheck className="text-teal-400 h-6 w-6" />
          <span className="text-xl font-bold text-cyan-400">SmartCivic</span>
        </div>

        <button
          onClick={handleLogout}
          className="glass px-4 py-2 rounded text-red-400 hover:bg-red-400 hover:text-white transition-all text-sm flex items-center space-x-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>


      <div className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">Admin Dashboard</h1>
              <p className="text-gray-400 text-lg">System overview and management controls</p>
            </div>

          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* User Management */}
            <div className="glass rounded-lg p-6 hover-lift group">
              <div className="flex items-center justify-between mb-4">
                <Users className="h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <span className="text-xs text-gray-400 bg-blue-400/10 px-2 py-1 rounded">Management</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">User Management</h3>
              <p className="text-gray-400 text-sm mb-4">View, edit, or delete citizen records</p>
              <button
                onClick={() => navigate('/admin/users')}
                className="w-full glass-dark py-2 px-4 rounded text-blue-400 hover:bg-blue-400 hover:text-white transition-all text-sm"
              >
                Manage Users
              </button>
            </div>

            {/* Department Control */}
            <div className="glass rounded-lg p-6 hover-lift group">
              <div className="flex items-center justify-between mb-4">
                <Building2 className="h-8 w-8 text-purple-400 group-hover:text-purple-300 transition-colors" />
                <span className="text-xs text-gray-400 bg-purple-400/10 px-2 py-1 rounded">Departments</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Department Control</h3>
              <p className="text-gray-400 text-sm mb-4">Add, edit, or remove department officials</p>
              <button
                onClick={() => navigate('/admin/departments')}
                className="w-full glass-dark py-2 px-4 rounded text-purple-400 hover:bg-purple-400 hover:text-white transition-all text-sm"
              >
                Manage Departments
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
