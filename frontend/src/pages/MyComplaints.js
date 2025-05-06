import React, { useEffect, useState } from "react";
import axios from "axios";
import ComplaintCard from "../components/ComplaintCard";

const API = "http://localhost:5000";

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get(`${API}/api/complaints/user`, { withCredentials: true });
        setComplaints(res.data);
      } catch (err) {
        alert("Failed to fetch complaints");
      }
    };
    fetchComplaints();
  }, []);

  return (
    <div className="max-w-4xl mx-auto my-10 px-4">
      <h2 className="text-2xl font-bold text-indigo-600 mb-6">My Complaints</h2>
      {complaints.length > 0 ? (
        complaints.map(c => <ComplaintCard key={c._id} complaint={c} />)
      ) : (
        <p className="text-gray-600">No complaints found.</p>
      )}
    </div>
  );
};

export default MyComplaints;
