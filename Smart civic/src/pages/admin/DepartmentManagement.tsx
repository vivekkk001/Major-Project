import React from 'react';
import { Building2, Plus, Edit, Trash2 } from 'lucide-react';
import Navbar from '../../components/Navbar';

const DepartmentManagement: React.FC = () => {
  const departments = [
    { id: 1, name: 'Parks and Recreation', head: 'John Smith', complaints: 45, status: 'active' },
    { id: 2, name: 'Road Maintenance', head: 'Sarah Johnson', complaints: 32, status: 'active' },
    { id: 3, name: 'Public Transportation', head: 'Mike Davis', complaints: 28, status: 'active' },
    { id: 4, name: 'Sewage', head: 'Lisa Brown', complaints: 19, status: 'active' },
    { id: 5, name: 'Electrical Department', head: 'Robert Wilson', complaints: 23, status: 'active' },
    { id: 6, name: 'Sanitation', head: 'Emily Davis', complaints: 31, status: 'active' },
    { id: 7, name: 'Water Supply', head: 'David Miller', complaints: 27, status: 'active' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      
      <div className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">Department Management</h1>
              <p className="text-gray-400 text-lg">Manage departments and their officials</p>
            </div>
            <button className="glass glow px-6 py-3 rounded-lg text-teal-400 hover:bg-teal-400 hover:text-white transition-all hover-lift ripple flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add Department</span>
            </button>
          </div>

          <div className="glass rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Department</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Department Head</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Active Complaints</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {departments.map((dept) => (
                    <tr key={dept.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Building2 className="h-5 w-5 text-teal-400 mr-3" />
                          <span className="text-white font-medium">{dept.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{dept.head}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-teal-400/20 text-teal-400 rounded text-sm">
                          {dept.complaints}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          dept.status === 'active' 
                            ? 'bg-green-400/20 text-green-400' 
                            : 'bg-red-400/20 text-red-400'
                        }`}>
                          {dept.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-400 hover:text-teal-400 transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                            <Trash2 className="h-4 w-4" />
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

export default DepartmentManagement;