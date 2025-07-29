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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">

      <div
        onClick={() => navigate('/home')}
        className="absolute top-6 left-20 flex items-center space-x-2 z-50 cursor-pointer"
      >
        <ShieldCheck className="text-teal-400 h-6 w-6" />
        <span className="text-xl font-bold text-cyan-400">SmartCivic</span>
      </div>
      <div className="absolute top-20 right-20 z-50">
              <button
                onClick={handleLogout}
                className="glass-dark px-4 py-2 rounded text-red-400 hover:bg-red-400 hover:text-white transition-all text-sm flex items-center space-x-2"
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
