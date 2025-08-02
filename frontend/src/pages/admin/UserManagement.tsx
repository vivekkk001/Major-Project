import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil, Trash2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Citizen {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const UserManagement: React.FC = () => {
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Citizen>>({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCitizens();
  }, []);

  const fetchCitizens = () => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/citizens`)
      .then((res) => setCitizens(res.data.citizens || []))
      .catch((err) => console.error('Failed to fetch citizens:', err));
  };

  const handleEditClick = (index: number) => {
    setEditIndex(index);
    setEditData(citizens[index]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const confirmText = prompt("Type 'save' to confirm saving changes:");
    if (confirmText?.toLowerCase() !== 'save') {
      alert("Save cancelled. You must type 'save' to proceed.");
      return;
    }

    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/admin/citizens/${editData.email}`, editData);
      setEditIndex(null);
      fetchCitizens();
    } catch (error) {
      console.error("Error updating citizen:", error);
    }
  };

  const handleDelete = async (email: string) => {
    const confirmText = prompt("Type 'delete' to confirm deleting this user:");
    if (confirmText?.toLowerCase() !== 'delete') {
      alert("Deletion cancelled. You must type 'delete' to proceed.");
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/admin/citizens/${email}`);
      fetchCitizens();
    } catch (error) {
      console.error("Error deleting citizen:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Top Bar */}
      <div className="absolute top-6 left-20 flex items-center space-x-2 z-50 cursor-pointer" onClick={() => navigate('/home')}>
        <ShieldCheck className="text-teal-400 h-6 w-6" />
        <span className="text-xl font-bold text-cyan-400">SmartCivic</span>
      </div>

      <div className="pt-24 px-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">Citizen Management</h1>
        <p className="text-gray-400 mb-8">List of all registered citizens</p>

        <div className="glass rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-gray-300">Name</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-300">Email</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-300">Phone</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-300">Address</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {citizens.map((citizen, index) => (
                <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-white">
                    {editIndex === index ? (
                      <input
                        type="text"
                        name="name"
                        value={editData.name || ''}
                        onChange={handleChange}
                        className="bg-slate-700 text-white px-2 py-1 rounded"
                      />
                    ) : (
                      citizen.name
                    )}
                  </td>
                  <td className="px-6 py-4 text-white">{citizen.email}</td>
                  <td className="px-6 py-4 text-white">
                    {editIndex === index ? (
                      <input
                        type="text"
                        name="phone"
                        value={editData.phone || ''}
                        onChange={handleChange}
                        className="bg-slate-700 text-white px-2 py-1 rounded"
                      />
                    ) : (
                      citizen.phone
                    )}
                  </td>
                  <td className="px-6 py-4 text-white">
                    {editIndex === index ? (
                      <input
                        type="text"
                        name="address"
                        value={editData.address || ''}
                        onChange={handleChange}
                        className="bg-slate-700 text-white px-2 py-1 rounded"
                      />
                    ) : (
                      citizen.address
                    )}
                  </td>
                  <td className="px-6 py-4 text-white space-x-2">
                    {editIndex === index ? (
                      <>
                        <button onClick={handleSave} className="text-green-400 hover:underline">Save</button>
                        <button onClick={() => setEditIndex(null)} className="text-red-400 hover:underline">Cancel</button>
                      </>
                    ) : (
                      <>
                        {/* <button onClick={() => handleEditClick(index)} className="text-teal-400 hover:underline">Edit</button> */}
                        <button onClick={() => handleDelete(citizen.email)} className="text-red-400 hover:underline">Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {citizens.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 py-8">
                    No citizens found.
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