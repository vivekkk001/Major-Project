import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
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
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [popupImage, setPopupImage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/all-complaints`);
      const sorted = (res.data.complaints || []).sort((a: Complaint, b: Complaint) => a.id - b.id);
      setComplaints(sorted);
    } catch (err) {
      console.error('Failed to fetch complaints:', err);
    }
  };

  const handleDelete = async (id: number) => {
    const confirm = window.confirm("Are you sure you want to delete this complaint?");
    if (!confirm) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/admin/complaints/${id}`);
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

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {particles}
        <div className="blob absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-teal-400/20 to-cyan-400/20 rounded-full morph"></div>
        <div className="blob absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full morph"></div>
        <div className="blob absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-teal-400/5 to-cyan-400/5 rounded-full morph"></div>
      </div>

      <div className="absolute top-6 left-6 flex items-center space-x-4 z-50">
        <button
          onClick={() => navigate(-1)}
          className="text-cyan-400 hover:text-teal-300 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>

        <div className="flex items-center space-x-2 cursor" onClick={() => navigate('')}>
          <ShieldCheck className="text-teal-400 h-6 w-6" />
          <span className="text-xl font-bold text-cyan-400">SmartCivic</span>
        </div>
      </div>

      <div className="pt-24 px-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">All Complaints</h1>
        <p className="text-gray-400 mb-4">Detailed complaint information for all citizens</p>

        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 mb-4">
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
              {filteredComplaints.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-white">{c.id}</td>
                  <td className="px-6 py-4 text-white">{c.citizen_name}</td>
                  <td className="px-6 py-4 text-white">{c.department}</td>
                  <td className="px-6 py-4 text-white">{c.description}</td>

                  <td className="px-6 py-4 text-white">
                    <button
                      onClick={() => setPopupImage(c.image_url)}
                      className="text-teal-300 hover:underline"
                    >
                      View
                    </button>
                  </td>

                  <td className="px-6 py-4 text-white">{c.status}</td>
                  <td className="px-6 py-4 text-white">{c.latitude}</td>
                  <td className="px-6 py-4 text-white">{c.longitude}</td>
                  <td className="px-6 py-4 text-white">{c.address}</td>

                  <td className="px-6 py-4 text-white">
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredComplaints.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center text-gray-400 py-8">
                    No complaints found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {popupImage && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="relative bg-slate-900 rounded-lg shadow-lg p-4 max-w-3xl w-full">
            <button
              onClick={() => setPopupImage(null)}
              className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 rounded-full p-1"
            >
              &times;
            </button>

            <img
              src={popupImage}
              alt="Complaint"
              className="rounded w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;
