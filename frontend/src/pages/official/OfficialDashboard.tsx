import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FileText, Clock, CheckCircle, AlertTriangle, ShieldCheck, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OfficialDashboard: React.FC = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [editedStatuses, setEditedStatuses] = useState<{ [key: string]: string }>({});
  const [editedDescriptions, setEditedDescriptions] = useState<{ [key: string]: string }>({});
  const [editedAddresses, setEditedAddresses] = useState<{ [key: string]: string }>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const department = localStorage.getItem('department') || 'Unknown';

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/complaints/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filtered = res.data.filter((c: any) => c.department === department);
        setComplaints(filtered);
      } catch (err) {
        console.error('Error fetching complaints:', err);
      }
    };
    fetchComplaints();
  }, [token, department]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/home');
    window.location.reload();
  };

  const handleChange = (id: string, field: 'status' | 'description' | 'address', value: string) => {
    if (field === 'status') {
      setEditedStatuses(prev => ({ ...prev, [id]: value }));
    } else if (field === 'description') {
      setEditedDescriptions(prev => ({ ...prev, [id]: value }));
    } else if (field === 'address') {
      setEditedAddresses(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleSave = async (id: string, field: 'status' | 'description' | 'address') => {
    const value =
      field === 'status' ? editedStatuses[id] :
        field === 'description' ? editedDescriptions[id] :
          editedAddresses[id];

    const userInput = window.prompt(`Type 'save' to confirm updating the ${field} of Complaint ID ${id}`);
    if (!userInput || userInput.trim().toLowerCase() !== 'save') {
      alert('Update canceled. You must type "save" to confirm.');
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/complaints/${id}/${field}`,
        { [field]: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComplaints(prev =>
        prev.map(c => (c.complaint_id === id ? { ...c, [field]: value } : c))
      );

      if (field === 'status') {
        const updated = { ...editedStatuses };
        delete updated[id];
        setEditedStatuses(updated);
      } else if (field === 'description') {
        const updated = { ...editedDescriptions };
        delete updated[id];
        setEditedDescriptions(updated);
      } else if (field === 'address') {
        const updated = { ...editedAddresses };
        delete updated[id];
        setEditedAddresses(updated);
      }

      alert(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`);
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
      alert(`Failed to update ${field}.`);
    }
  };

  const openModal = (url: string) => {
    setSelectedImage(url);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const filteredComplaints = complaints.filter(c =>
    searchQuery.trim() === '' || c.complaint_id.toString().includes(searchQuery.trim())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">

      {/* Top Bar */}
      <div className="absolute top-6 left-20 flex items-center space-x-2 z-50 cursor-pointer" onClick={() => navigate('/home')}>
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

      {/* Main Content */}
      <div className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Department Dashboard</h1>
            <p className="text-gray-400 text-lg">Manage assigned complaints and track department performance</p>
            <p className="text-teal-400 mt-2 text-sm">
              Currently logged in through: <span className="font-semibold">{department} department</span>
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="glass rounded-lg p-6 hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Assigned Complaints</p>
                  <p className="text-2xl font-bold text-white">{complaints.length}</p>
                </div>
                <FileText className="h-8 w-8 text-teal-400" />
              </div>
            </div>
            <div className="glass rounded-lg p-6 hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pending Review</p>
                  <p className="text-2xl font-bold text-white">{complaints.filter(c => c.status === 'Pending').length}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </div>
            <div className="glass rounded-lg p-6 hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Resolved</p>
                  <p className="text-2xl font-bold text-white">{complaints.filter(c => c.status === 'Resolved').length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </div>
            <div className="glass rounded-lg p-6 hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">In Progress</p>
                  <p className="text-2xl font-bold text-white">{complaints.filter(c => c.status === 'In Progress').length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by Complaint ID"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-600 bg-slate-800 text-white w-full sm:w-96"
            />
          </div>

          {/* Complaint List */}
          <div className="space-y-6">
            {filteredComplaints.length > 0 ? (
              filteredComplaints.map(c => {
                const id = c.complaint_id;
                const status = editedStatuses[id] ?? c.status;
                const desc = editedDescriptions[id] ?? c.description;
                const addr = editedAddresses[id] ?? c.address;

                return (
                  <div key={id} className="glass rounded-xl p-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xl font-semibold text-white">{c.title || 'Complaint Details'}</h3>
                      <span className="text-sm bg-yellow-600 text-white px-3 py-1 rounded-full">{status}</span>
                    </div>
                    <p className="text-gray-300 mb-2">{desc}</p>
                    <div className="text-gray-400 text-sm mb-2">
                      <p>Location: {addr}</p>
                      <p>Complaint ID: <span className="text-teal-400">{id}</span></p>
                    </div>

                    {c.image_url && (
                      <button
                        onClick={() => openModal(c.image_url)}
                        className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Show Image
                      </button>
                    )}

                    {/* Editable Fields */}
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm text-gray-300 mb-1">Description</label>
                        <textarea
                          value={desc}
                          readOnly
                          onChange={e => handleChange(id, 'description', e.target.value)}
                          rows={2}
                          className="w-full rounded bg-slate-700 border border-gray-600 text-white p-2"
                        />
                        {/* {desc !== c.description && (
                          <button
                            onClick={() => handleSave(id, 'description')}
                            className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          >
                            Save Description
                          </button>
                        )} */}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300 mb-1">Address</label>
                        <textarea
                          value={addr}
                          readOnly
                          onChange={e => handleChange(id, 'address', e.target.value)}
                          rows={2}
                          className="w-full rounded bg-slate-700 border border-gray-600 text-white p-2"
                        />
                        {/* {addr !== c.address && (
                          <button
                            onClick={() => handleSave(id, 'address')}
                            className="mt-2 bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                          >
                            Save Address
                          </button>
                        )} */}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300 mb-1">Update Status</label>
                        <select
                          value={status}
                          onChange={e => handleChange(id, 'status', e.target.value)}
                          className="bg-slate-800 border border-gray-600 text-white rounded px-3 py-2"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                        {status !== c.status && (
                          <button
                            onClick={() => handleSave(id, 'status')}
                            className="mt-2 ml-3 bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600"
                          >
                            Save Status
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-400">No complaints found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isModalOpen && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="relative max-w-2xl w-full bg-slate-800 border border-gray-600 rounded-2xl p-4 shadow-lg">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow transition-all"
            >
              &times;
            </button>
            <img
              src={selectedImage}
              alt="Complaint"
              className="w-full h-auto rounded-xl mt-2"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficialDashboard;
