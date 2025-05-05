import React from "react";

const ComplaintCard = ({ complaint }) => (
  <div className="bg-white shadow-md rounded p-4 mb-4">
    <h3 className="font-semibold text-indigo-600">{complaint.department}</h3>
    <p className="mt-2">{complaint.description}</p>
    <p className="text-sm text-gray-500 mt-2">Status: {complaint.status}</p>
  </div>
);

export default ComplaintCard;
