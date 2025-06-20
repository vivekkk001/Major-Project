import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';

interface User {
  id: number;
  name: string;
  email: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/admin/users')
      .then((res) => setUsers(res.data.users || []))
      .catch((err) => console.error('Failed to fetch users:', err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <div className="pt-24 px-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">User Management</h1>
        <p className="text-gray-400 mb-8">List of all registered users</p>

        <div className="glass rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-gray-300">ID</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-300">Name</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-300">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-white">{user.id}</td>
                  <td className="px-6 py-4 text-white">{user.name}</td>
                  <td className="px-6 py-4 text-white">{user.email}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-gray-400 py-8">
                    No users found.
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

export default UserManagement;
