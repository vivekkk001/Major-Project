import React, { useEffect, useState } from "react";
import axios from "axios";

const OfficialDashboard = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get("/api/official/complaints", { withCredentials: true });
        setComplaints(res.data);
      } catch (error) {
        console.error("Error fetching complaints", error);
      }
    };
    fetchComplaints();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/official/complaints/${id}/status`, { status }, { withCredentials: true });
      setComplaints(prev =>
        prev.map(c => (c.id === id ? { ...c, status } : c))
      );
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Official Complaint Dashboard</h2>
      <table className="w-full text-left table-auto border-collapse">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Citizen</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Update</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map(complaint => (
            <tr key={complaint.id} className="border-b">
              <td className="p-2 border">{complaint.id}</td>
              <td className="p-2 border">{complaint.user_email}</td>
              <td className="p-2 border">{complaint.description}</td>
              <td className="p-2 border">{complaint.status}</td>
              <td className="p-2 border">
                <select
                  className="border rounded px-2 py-1"
                  value={complaint.status}
                  onChange={e => updateStatus(complaint.id, e.target.value)}
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OfficialDashboard;
