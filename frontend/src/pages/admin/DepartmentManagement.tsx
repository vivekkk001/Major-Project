import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { unparse } from "papaparse";

interface Complaint {
  id: number;
  citizen_name: string;
  department: string;
  description: string;
  status: string;
  latitude: number;
  longitude: number;
  address: string;
  image_url: string;
}

const DepartmentManagement: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Complaint>>({});
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [popupImage, setPopupImage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/all-complaints');
      const sorted = (res.data.complaints || []).sort((a: Complaint, b: Complaint) => a.id - b.id);
      setComplaints(sorted);
    } catch (err) {
      console.error('Failed to fetch complaints:', err);
    }
  };

  const handleEditClick = (index: number) => {
    setEditIndex(index);
    setEditData(complaints[index]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const confirmText = prompt("Type 'save' to confirm saving changes:");
    if (confirmText?.toLowerCase() !== 'save') {
      alert("Save cancelled. You must type 'save' to proceed.");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/admin/complaints/${editData.id}`, editData);
      setEditIndex(null);
      fetchComplaints();
    } catch (error) {
      console.error("Error updating complaint:", error);
    }
  };

  const handleDelete = async (id: number) => {
    const confirm = window.confirm("Are you sure you want to delete this complaint?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/complaints/${id}`);
      fetchComplaints();
    } catch (error) {
      console.error("Error deleting complaint:", error);
    }
  };

  const handleExportCSV = () => {
    const csvData = unparse(complaints);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "complaints.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredComplaints = complaints.filter(c =>
    (!filterDepartment || c.department === filterDepartment) &&
    (!filterStatus || c.status === filterStatus)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Top Bar */}
      <div className="absolute top-6 left-20 flex items-center space-x-2 z-50 cursor-pointer" onClick={() => navigate('/home')}>
        <ShieldCheck className="text-teal-400 h-6 w-6" />
        <span className="text-xl font-bold text-cyan-400">SmartCivic</span>
      </div>

      <div className="pt-24 px-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">All Complaints</h1>
        <p className="text-gray-400 mb-4">Detailed complaint information for all citizens</p>

        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            placeholder="Filter by Department"
            className="bg-slate-700 text-white px-3 py-2 rounded"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Status"
            className="bg-slate-700 text-white px-3 py-2 rounded"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          />
          <button onClick={handleExportCSV} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded">
            Export CSV
          </button>
        </div>

        <div className="glass rounded-xl overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-gray-300">ID</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-300">Citizen</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-300">Department</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-300">Description</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-300">Image</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-300">Status</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-300">Latitude</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-300">Longitude</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-300">Address</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredComplaints.map((c, index) => (
                <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-white">{c.id}</td>
                  <td className="px-6 py-4 text-white">{c.citizen_name}</td>
                  <td className="px-6 py-4 text-white">{c.department}</td>
                  <td className="px-6 py-4 text-white">
                    {editIndex === index ? (
                      <textarea
                        name="description"
                        value={editData.description || ''}
                        onChange={handleChange}
                        className="bg-slate-700 text-white px-2 py-1 rounded w-full"
                      />
                    ) : (
                      c.description
                    )}
                  </td>
                  <td className="px-6 py-4 text-white">
                    <button
                      onClick={() => setPopupImage(c.image_url)}
                      className="text-teal-300 hover:underline"
                    >
                      View
                    </button>
                  </td>
                  <td className="px-6 py-4 text-white">
                    {editIndex === index ? (
                      <input
                        name="status"
                        value={editData.status || ''}
                        onChange={handleChange}
                        className="bg-slate-700 text-white px-2 py-1 rounded"
                      />
                    ) : (
                      c.status
                    )}
                  </td>
                  <td className="px-6 py-4 text-white">
                    {editIndex === index ? (
                      <input
                        name="latitude"
                        value={editData.latitude || ''}
                        onChange={handleChange}
                        className="bg-slate-700 text-white px-2 py-1 rounded"
                      />
                    ) : (
                      c.latitude
                    )}
                  </td>
                  <td className="px-6 py-4 text-white">
                    {editIndex === index ? (
                      <input
                        name="longitude"
                        value={editData.longitude || ''}
                        onChange={handleChange}
                        className="bg-slate-700 text-white px-2 py-1 rounded"
                      />
                    ) : (
                      c.longitude
                    )}
                  </td>
                  <td className="px-6 py-4 text-white">
                    {editIndex === index ? (
                      <input
                        name="address"
                        value={editData.address || ''}
                        onChange={handleChange}
                        className="bg-slate-700 text-white px-2 py-1 rounded"
                      />
                    ) : (
                      c.address
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
                        {/* <button onClick={() => handleEditClick(index)} className="text-blue-400 hover:underline">Edit</button> */}
                        <button onClick={() => handleDelete(c.id)} className="text-red-400 hover:underline">Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {filteredComplaints.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center text-gray-400 py-8">No complaints found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image popup modal */}
      {popupImage && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="relative bg-slate-900 rounded-lg shadow-lg p-4 max-w-3xl w-full">
            <button
              onClick={() => setPopupImage(null)}
              className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 rounded-full p-1"
            >
              &times;
            </button>
            <img src={popupImage} alt="Complaint" className="rounded w-full max-h-[80vh] object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;
