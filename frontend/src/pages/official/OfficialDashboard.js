import React, { useEffect, useState } from "react";
import axios from "axios";

const OfficialDashboard = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/complaints/assigned")
      .then((res) => setComplaints(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Assigned Complaints</h1>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c) => (
            <tr key={c.id}>
              <td className="border p-2">{c.id}</td>
              <td className="border p-2">{c.description}</td>
              <td className="border p-2">{c.status}</td>
              <td className="border p-2">
                <button className="bg-green-500 text-white px-2 py-1 rounded">Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OfficialDashboard;
