import React, { useState, useEffect } from 'react';
import { Search, Filter, FileText, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ComplaintCard from '../components/ComplaintCard';

const MyComplaints: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // <-- NEW

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/complaints/my-complaints`,
          { withCredentials: true }
        );
        console.log("Fetched complaints:", res.data);
        setComplaints(res.data || []);
      } catch (err) {
        console.error('Failed to fetch complaints:', err);
      } finally {
        setLoading(false); // <-- END LOADING
      }
    };

    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch = complaint.description
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || complaint.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="blob absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-teal-400/10 to-cyan-400/10 rounded-full morph"></div>
        <div className="blob absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full morph"></div>
      </div>

      <div className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">My Complaints</h1>
              <p className="text-gray-400 text-lg">
                Track and manage all your submitted complaints
              </p>
            </div>
            <Link
              to="/complaint"
              className="mt-6 lg:mt-0 glass glow px-6 py-3 rounded-lg text-teal-400 hover:bg-teal-400 hover:text-white transition-all hover-lift ripple flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>New Complaint</span>
            </Link>
          </div>

          {/* Search & Filter */}
          <div className="glass rounded-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search complaints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="glass-dark w-full pl-10 pr-4 py-3 rounded-lg border border-gray-600 focus:border-teal-400 focus:outline-none transition-colors text-white placeholder-gray-400"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="glass-dark px-4 py-3 rounded-lg border border-gray-600 focus:border-teal-400 focus:outline-none transition-colors text-white"
                >
                  <option value="all" className="bg-slate-800">All Status</option>
                  <option value="pending" className="bg-slate-800">Pending</option>
                  <option value="in-progress" className="bg-slate-800">In Progress</option>
                  <option value="resolved" className="bg-slate-800">Resolved</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="glass rounded-lg p-6 text-center hover-lift">
              <div className="text-2xl font-bold text-white mb-1">{complaints.length}</div>
              <div className="text-gray-400 text-sm">Total Complaints</div>
            </div>
            <div className="glass rounded-lg p-6 text-center hover-lift">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {complaints.filter(c => c.status === 'Pending').length}
              </div>
              <div className="text-gray-400 text-sm">Pending</div>
            </div>
            <div className="glass rounded-lg p-6 text-center hover-lift">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {complaints.filter(c => c.status === 'In Progress').length}
              </div>
              <div className="text-gray-400 text-sm">In Progress</div>
            </div>
            <div className="glass rounded-lg p-6 text-center hover-lift">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {complaints.filter(c => c.status === 'Resolved').length}
              </div>
              <div className="text-gray-400 text-sm">Resolved</div>
            </div>
          </div>

          {/* Complaints List */}
          <div className="space-y-6">

            {/* Loading Spinner */}
            {loading && (
              <div className="w-full py-24 flex justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-400 border-opacity-60"></div>
              </div>
            )}

            {/* Render complaints only after loading */}
            {!loading && (
              filteredComplaints.length > 0 ? (
                filteredComplaints.map((complaint) => {
                  return (
                    <div
                      key={complaint.complaint_id}
                      className="glass rounded-xl p-6 hover-lift"
                    >
                      <ComplaintCard {...complaint} />

                      {/* HASH ACTION ROW */}
                      <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">

                        {/* Pending */}
                        {complaint.pending_hash && (
                          <button
                            onClick={() =>
                              window.open(`https://sepolia.etherscan.io/tx/${complaint.pending_hash}`, "_blank")
                            }
                            className="flex-1 glass glow px-5 py-3 rounded-lg text-yellow-300 hover:bg-yellow-400 hover:text-white transition-all"
                          >
                            Verify Pending Transaction
                          </button>
                        )}

                        {/* In Progress */}
                        {complaint.progress_hash && (
                          <button
                            onClick={() =>
                              window.open(`https://sepolia.etherscan.io/tx/${complaint.progress_hash}`, "_blank")
                            }
                            className="flex-1 glass glow px-5 py-3 rounded-lg text-blue-300 hover:bg-blue-400 hover:text-white transition-all"
                          >
                            Verify In-Progress Transaction
                          </button>
                        )}

                        {/* Resolved */}
                        {complaint.resolved_hash && (
                          <button
                            onClick={() =>
                              window.open(`https://sepolia.etherscan.io/tx/${complaint.resolved_hash}`, "_blank")
                            }
                            className="flex-1 glass glow px-5 py-3 rounded-lg text-green-300 hover:bg-green-400 hover:text-white transition-all"
                          >
                            Verify Resolved Transaction
                          </button>
                        )}

                        {/* USER — Mark complaint as resolved */}
                        {complaint.status === "in-progress" && (
                          <button
                            onClick={async () => {
                              setComplaints(prev =>
                                prev.map(c =>
                                  c.complaint_id === complaint.complaint_id
                                    ? { ...c, loading: true }
                                    : c
                                )
                              );
                              try {
                                const res = await axios.put(
                                  `${import.meta.env.VITE_API_BASE_URL}/api/complaints/update-status`,
                                  {
                                    complaintId: complaint.complaint_id,
                                    newStatus: "resolved",
                                  },
                                  { withCredentials: true }
                                );
                                const updated = res.data.complaint;
                                // update UI without reload
                                setComplaints(prev =>
                                  prev.map(c =>
                                    c.complaint_id === complaint.complaint_id
                                      ? { ...c, ...updated, loading: false }
                                      : c
                                  )
                                );
                              } catch (err) {
                                alert("Failed to update status.");
                                console.error(err);
                                setComplaints(prev =>
                                  prev.map(c =>
                                    c.complaint_id === complaint.complaint_id
                                      ? { ...c, loading: false }
                                      : c
                                  )
                                );
                              }
                            }}
                            className={`flex-1 px-5 py-3 rounded-lg font-semibold transition-all duration-300 ${complaint.loading
                                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 hover:shadow-lg hover:scale-105"
                              }`}
                            disabled={complaint.loading}
                          >
                            {complaint.loading ? (
                              "Updating..."
                            ) : (
                              "Mark as Resolved"
                            )}
                          </button>
                        )}


                      </div>

                    </div>
                  );
                })
              ) : (

                <div className="glass rounded-xl p-12 text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No complaints found
                  </h3>
                  <p className="text-gray-400 mb-6">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "You haven't submitted any complaints yet"}
                  </p>
                  {!searchTerm && statusFilter === "all" && (
                    <Link
                      to="/complaint"
                      className="inline-flex items-center space-x-2 glass glow px-6 py-3 rounded-lg text-teal-400 hover:bg-teal-400 hover:text-white transition-all hover-lift ripple"
                    >
                      <Plus className="h-5 w-5" />
                      <span>File Your First Complaint</span>
                    </Link>
                  )}
                </div>

              )
            )}

          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyComplaints;
