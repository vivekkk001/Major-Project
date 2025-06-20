import React from 'react';
import { Users, FileText, Building2, TrendingUp } from 'lucide-react';
import Navbar from '../../components/Navbar';

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <div className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Admin Dashboard</h1>
            <p className="text-gray-400 text-lg">System overview and management controls</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="glass rounded-lg p-6 hover-lift group">
              <div className="flex items-center justify-between mb-4">
                <Users className="h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <span className="text-xs text-gray-400 bg-blue-400/10 px-2 py-1 rounded">Management</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">User Management</h3>
              <p className="text-gray-400 text-sm mb-4">Manage platform users and permissions</p>
              <button className="w-full glass-dark py-2 px-4 rounded text-blue-400 hover:bg-blue-400 hover:text-white transition-all text-sm">
                Manage Users
              </button>
            </div>

            <div className="glass rounded-lg p-6 hover-lift group">
              <div className="flex items-center justify-between mb-4">
                <Building2 className="h-8 w-8 text-purple-400 group-hover:text-purple-300 transition-colors" />
                <span className="text-xs text-gray-400 bg-purple-400/10 px-2 py-1 rounded">Departments</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Department Control</h3>
              <p className="text-gray-400 text-sm mb-4">Oversee department operations and officials</p>
              <button className="w-full glass-dark py-2 px-4 rounded text-purple-400 hover:bg-purple-400 hover:text-white transition-all text-sm">
                Manage Departments
              </button>
            </div>

            <div className="glass rounded-lg p-6 hover-lift group">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="h-8 w-8 text-green-400 group-hover:text-green-300 transition-colors" />
                <span className="text-xs text-gray-400 bg-green-400/10 px-2 py-1 rounded">Analytics</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">System Analytics</h3>
              <p className="text-gray-400 text-sm mb-4">View detailed system performance metrics</p>
              <button className="w-full glass-dark py-2 px-4 rounded text-green-400 hover:bg-green-400 hover:text-white transition-all text-sm">
                View Analytics
              </button>
            </div>
          </div>
          {/* Add real dashboard content here */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;