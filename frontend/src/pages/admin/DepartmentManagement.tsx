import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';

interface Department {
  id: number;
  name: string;
}

const DepartmentManagement: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/admin/departments')
      .then((res) => setDepartments(res.data.departments || []))
      .catch((err) => console.error('Failed to fetch departments:', err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <div className="pt-24 px-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">Department Management</h1>
        <p className="text-gray-400 mb-8">List of all departments</p>

        <div className="glass rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-gray-300">ID</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-300">Name</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-white">{dept.id}</td>
                  <td className="px-6 py-4 text-white">{dept.name}</td>
                </tr>
              ))}
              {departments.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-center text-gray-400 py-8">
                    No departments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DepartmentManagement;
