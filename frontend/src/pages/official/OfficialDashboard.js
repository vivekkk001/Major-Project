import React, { useEffect, useState } from "react";
import axios from "axios";

const OfficialDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [editedStatuses, setEditedStatuses] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/complaints/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComplaints(res.data);
      } catch (err) {
        console.error("Error fetching complaints:", err);
      }
    };
    fetchComplaints();
  }, [token]);

  const handleStatusChange = (id, newStatus) => {
    setEditedStatuses((prev) => ({ ...prev, [id]: newStatus }));
  };

  const handleSaveStatus = async (id) => {
    const newStatus = editedStatuses[id];
    try {
      await axios.put(
        `http://localhost:5000/api/complaints/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setComplaints((prev) =>
        prev.map((c) =>
          c.complaint_id === id ? { ...c, status: newStatus } : c
        )
      );

      // Clear edited status
      setEditedStatuses((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });

      window.alert("Status updated successfully!");
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Citizen Complaints</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">ID</th>
              <th className="border p-3 text-left">Description</th>
              <th className="border p-3 text-left">Status</th>
              <th className="border p-3 text-left">Department</th>
              <th className="border p-3 text-left">Date</th>
              <th className="border p-3 text-left">Update</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length > 0 ? (
              complaints.map((c) => {
                const currentStatus = c.status || "Pending";
                const editedStatus = editedStatuses[c.complaint_id] ?? currentStatus;

                return (
                  <tr key={c.complaint_id} className="hover:bg-gray-50">
                    <td className="border p-3">{c.complaint_id}</td>
                    <td className="border p-3">{c.description}</td>
                    <td className="border p-3">{currentStatus}</td>
                    <td className="border p-3">{c.department}</td>
                    <td className="border p-3">
                      {new Date(c.created_at).toLocaleString()}
                    </td>
                    <td className="border p-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={editedStatus}
                          onChange={(e) =>
                            handleStatusChange(c.complaint_id, e.target.value)
                          }
                          className="border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                        {editedStatus !== currentStatus && (
                          <button
                            onClick={() => handleSaveStatus(c.complaint_id)}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                          >
                            Save
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center border p-4">
                  No complaints found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OfficialDashboard;
