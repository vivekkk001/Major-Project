import React from 'react';
import { Users, Search, Filter, UserCheck, UserX, Edit } from 'lucide-react';
import Navbar from '../../components/Navbar';

const UserManagement: React.FC = () => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Citizen', complaints: 5, status: 'active', joinDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Official', complaints: 0, status: 'active', joinDate: '2024-01-10' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Citizen', complaints: 12, status: 'suspended', joinDate: '2023-12-20' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Citizen', complaints: 3, status: 'active', joinDate: '2024-01-20' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      
      <div className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">User Management</h1>
            <p className="text-gray-400 text-lg">Manage platform users and their permissions</p>
          </div>

          {/* Search and Filter */}
          <div className="glass rounded-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  className="glass-dark w-full pl-10 pr-4 py-3 rounded-lg border border-gray-600 focus:border-teal-400 focus:outline-none transition-colors text-white placeholder-gray-400"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select className="glass-dark px-4 py-3 rounded-lg border border-gray-600 focus:border-teal-400 focus:outline-none transition-colors text-white">
                  <option value="all" className="bg-slate-800">All Users</option>
                  <option value="citizen" className="bg-slate-800">Citizens</option>
                  <option value="official" className="bg-slate-800">Officials</option>
                  <option value="admin" className="bg-slate-800">Admins</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="glass rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">User</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Complaints</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Join Date</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-medium">{user.name}</div>
                          <div className="text-gray-400 text-sm">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-400/20 text-blue-400 rounded text-sm">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{user.complaints}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          user.status === 'active' 
                            ? 'bg-green-400/20 text-green-400' 
                            : 'bg-red-400/20 text-red-400'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{user.joinDate}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-400 hover:text-teal-400 transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-green-400 transition-colors">
                            <UserCheck className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                            <UserX className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;