import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const OfficialDashboard: React.FC = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [editedStatuses, setEditedStatuses] = useState<{ [key: string]: string }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const department = localStorage.getItem("department") || "Unknown";

  // Convert Backend → UI Format
  const mapBackendToUI = (status: string) => {
    if (status === "pending") return "Pending";
    if (status === "in-progress") return "In Progress";
    if (status === "resolved") return "Resolved";
    return status;
  };

  const mapUIToBackend = (status: string) => {
    if (status === "Pending") return "pending";
    if (status === "In Progress") return "in-progress";
    if (status === "Resolved") return "resolved";
    return status;
  };

  // Fetch Complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/complaints/all`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const filtered = res.data.filter(
          (c: any) => c.department === department
        );

        // Fix: Convert backend status → UI status
        setComplaints(
          filtered.map((c: any) => ({
            ...c,
            status: mapBackendToUI(c.status),
          }))
        );
      } catch (err) {
        console.error("Error fetching complaints:", err);
      }
    };

    fetchComplaints();
  }, [token, department]);

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/official/login");
    window.location.reload();
  };

  // Update Local State (Dropdown change)
  const handleChange = (id: string, value: string) => {
    setEditedStatuses((prev) => ({ ...prev, [id]: value }));
  };

  // Save Status Only
  const handleSaveStatus = async (id: string) => {
    const uiStatus = editedStatuses[id];
    const newStatus = mapUIToBackend(uiStatus);

    const confirm = window.prompt(
      `Type 'save' to confirm updating the status of Complaint ID ${id}`
    );
    if (!confirm || confirm.trim().toLowerCase() !== "save") {
      alert("Update canceled.");
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/complaints/update-status`,
        {
          complaintId: id,
          newStatus: newStatus,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update UI instantly
      setComplaints((prev) =>
        prev.map((c) =>
          c.complaint_id === id ? { ...c, status: uiStatus } : c
        )
      );

      // Remove from edited list
      const updated = { ...editedStatuses };
      delete updated[id];
      setEditedStatuses(updated);

      alert("Status updated successfully!");
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    }
  };

  // Image Modal
  const openModal = (url: string) => {
    setSelectedImage(url);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  // Search Filter
  const filteredComplaints = complaints.filter(
    (c) =>
      searchQuery.trim() === "" ||
      c.complaint_id.toString().includes(searchQuery.trim())
  );

  // UI Rendering
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">

      {/* Top Bar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-slate-900/60 backdrop-blur-md border-b border-slate-700 px-6 py-4 flex items-center justify-between">
        <div
          className="flex items-center space-x-2 cursor-default"
          onClick={() => navigate('')}
        >
          <ShieldCheck className="text-teal-400 h-6 w-6" />
          <span className="text-xl font-bold text-cyan-400">SmartCivic</span>
        </div>

        <button
          onClick={() => navigate('/home')}
          className="glass px-4 py-2 rounded text-red-400 hover:bg-red-400 hover:text-white transition-all text-sm flex items-center space-x-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Page Title */}
          <h1 className="text-4xl font-bold text-white mb-2">
            Department Dashboard
          </h1>

          <p className="text-lg text-teal-300 mb-6">
            Logged in Department: <span className="font-semibold">{department}</span>
          </p>


          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by Complaint ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-600 bg-slate-800 text-white w-full sm:w-96"
            />
          </div>

          {/* Complaint Cards */}
          <div className="space-y-6">
            {filteredComplaints.length > 0 ? (
              filteredComplaints.map((c) => {
                const id = c.complaint_id;
                const status = editedStatuses[id] ?? c.status;

                return (
                  <div key={id} className="glass rounded-xl p-6 border border-white/10">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xl font-semibold text-white">
                        Complaint Details
                      </h3>
                      <span className="text-sm bg-yellow-600 text-white px-3 py-1 rounded-full">
                        {status}
                      </span>
                    </div>

                    <p className="text-gray-300 mb-2">{c.description}</p>

                    <div className="text-gray-400 text-sm mb-2">
                      <p>Location: {c.address}</p>
                      <p>
                        Complaint ID:{" "}
                        <span className="text-teal-400">{id}</span>
                      </p>
                    </div>

                    {c.image_url && (
                      <button
                        onClick={() => openModal(c.image_url)}
                        className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Show Image
                      </button>
                    )}

                    {/* Status Update */}
                    <div className="mt-4">
                      <label className="block text-sm text-gray-300 mb-1">
                        Update Status
                      </label>

                      <select
                        value={status}
                        onChange={(e) => handleChange(id, e.target.value)}
                        className="bg-slate-800 border border-gray-600 text-white rounded px-3 py-2"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        {/* Officials cannot resolve */}
                      </select>

                      {status !== c.status && (
                        <button
                          disabled={c.loading}
                          onClick={async () => {
                            // Set loading for this complaint
                            setComplaints(prev =>
                              prev.map(item =>
                                item.complaint_id === id ? { ...item, loading: true } : item
                              )
                            );

                            const uiStatus = editedStatuses[id];
                            const newStatus = mapUIToBackend(uiStatus);

                            const confirm = window.prompt(
                              `Type 'save' to confirm updating the status of Complaint ID ${id}`
                            );
                            if (!confirm || confirm.trim().toLowerCase() !== "save") {
                              alert("Update canceled.");

                              setComplaints(prev =>
                                prev.map(item =>
                                  item.complaint_id === id ? { ...item, loading: false } : item
                                )
                              );

                              return;
                            }

                            try {
                              const res = await axios.put(
                                `${import.meta.env.VITE_API_BASE_URL}/api/complaints/update-status`,
                                {
                                  complaintId: id,
                                  newStatus: newStatus,
                                },
                                { headers: { Authorization: `Bearer ${token}` } }
                              );

                              const updated = res.data.complaint;

                              // Update UI instantly
                              setComplaints(prev =>
                                prev.map(item =>
                                  item.complaint_id === id
                                    ? { ...item, ...updated, status: uiStatus, loading: false }
                                    : item
                                )
                              );

                              // Remove edited status selection
                              const updatedList = { ...editedStatuses };
                              delete updatedList[id];
                              setEditedStatuses(updatedList);

                              alert("Status updated successfully!");
                            } catch (err) {
                              console.error("Error updating status:", err);
                              alert("Failed to update status.");

                              setComplaints(prev =>
                                prev.map(item =>
                                  item.complaint_id === id ? { ...item, loading: false } : item
                                )
                              );
                            }
                          }}
                          className={`mt-2 ml-3 px-4 py-2 rounded text-white transition-all ${c.loading
                            ? "bg-orange-300 cursor-not-allowed opacity-60"
                            : "bg-orange-500 hover:bg-orange-600"
                            }`}
                        >
                          {c.loading ? (
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                              <span>Saving...</span>
                            </div>
                          ) : (
                            "Save Status"
                          )}
                        </button>
                      )}

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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="relative w-[90vw] max-w-5xl bg-slate-800 border border-gray-600 rounded-2xl p-4 shadow-lg">

            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium"
            >
              ×
            </button>

            {/* Fullscreen responsive image */}
            <img
              src={selectedImage}
              className="w-full max-h-[80vh] object-contain rounded-xl mt-2"
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default OfficialDashboard;
