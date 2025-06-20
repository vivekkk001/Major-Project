// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const OfficialDashboard = () => {
//   const [complaints, setComplaints] = useState([]);
//   const [editedStatuses, setEditedStatuses] = useState({});
//   const [editedDescriptions, setEditedDescriptions] = useState({});
//   const [editedAddresses, setEditedAddresses] = useState({});
//   const [expandedId, setExpandedId] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");

//   const token = localStorage.getItem("token");
//   const department = localStorage.getItem("department");

//   useEffect(() => {
//     const fetchComplaints = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:5000/api/complaints/all?department=${department}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setComplaints(res.data);
//       } catch (err) {
//         console.error("Error fetching complaints:", err);
//       }
//     };
//     fetchComplaints();
//   }, [token, department]);

//   const handleStatusChange = (id, newStatus) => {
//     setEditedStatuses((prev) => ({ ...prev, [id]: newStatus }));
//   };

//   const handleDescriptionChange = (id, value) => {
//     setEditedDescriptions((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleAddressChange = (id, value) => {
//     setEditedAddresses((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleSaveStatus = async (id) => {
//     const newStatus = editedStatuses[id];
//     try {
//       await axios.put(
//         `http://localhost:5000/api/complaints/${id}/status`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setComplaints((prev) =>
//         prev.map((c) =>
//           c.complaint_id === id ? { ...c, status: newStatus } : c
//         )
//       );
//       setEditedStatuses((prev) => {
//         const updated = { ...prev };
//         delete updated[id];
//         return updated;
//       });
//       window.alert("Status updated successfully!");
//     } catch (err) {
//       console.error("Error updating status:", err);
//       alert("Failed to update status.");
//     }
//   };

//   const handleSaveDescription = async (id) => {
//     const newDesc = editedDescriptions[id];
//     try {
//       await axios.put(
//         `http://localhost:5000/api/complaints/${id}/description`,
//         { description: newDesc },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setComplaints((prev) =>
//         prev.map((c) =>
//           c.complaint_id === id ? { ...c, description: newDesc } : c
//         )
//       );
//       setEditedDescriptions((prev) => {
//         const updated = { ...prev };
//         delete updated[id];
//         return updated;
//       });
//       window.alert("Description updated successfully!");
//     } catch (err) {
//       console.error("Error updating description:", err);
//       alert("Failed to update description.");
//     }
//   };

//   const handleSaveAddress = async (id) => {
//     const newAddress = editedAddresses[id];
//     try {
//       await axios.put(
//         `http://localhost:5000/api/complaints/${id}/address`,
//         { address: newAddress },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setComplaints((prev) =>
//         prev.map((c) =>
//           c.complaint_id === id ? { ...c, address: newAddress } : c
//         )
//       );
//       setEditedAddresses((prev) => {
//         const updated = { ...prev };
//         delete updated[id];
//         return updated;
//       });
//       window.alert("Address updated successfully!");
//     } catch (err) {
//       console.error("Error updating address:", err);
//       alert("Failed to update address.");
//     }
//   };

//   const filteredComplaints = complaints.filter(
//     (c) =>
//       searchQuery.trim() === "" ||
//       c.complaint_id.toString() === searchQuery.trim()
//   );

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6 text-center">
//         Department Complaints
//       </h1>

//       <div className="mb-4 flex justify-center">
//         <input
//           type="text"
//           placeholder="Search by Complaint ID"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="border px-3 py-2 rounded w-64"
//         />
//       </div>

//       <div className="overflow-x-auto rounded shadow">
//         <table className="min-w-full border border-gray-300 text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="border p-2 text-left">Complaint ID</th>
//               <th className="border p-2 text-left">Status</th>
//               <th className="border p-2 text-left">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredComplaints.length > 0 ? (
//               filteredComplaints.map((c) => {
//                 const currentStatus = c.status || "Pending";
//                 const editedStatus =
//                   editedStatuses[c.complaint_id] ?? currentStatus;
//                 const editedDesc =
//                   editedDescriptions[c.complaint_id] ?? c.description;
//                 const editedAddress =
//                   editedAddresses[c.complaint_id] ?? c.address;
//                 const isExpanded = expandedId === c.complaint_id;

//                 return (
//                   <React.Fragment key={c.complaint_id}>
//                     <tr className="hover:bg-gray-50">
//                       <td
//                         className="border p-2 cursor-pointer text-blue-600 underline"
//                         onClick={() =>
//                           setExpandedId(
//                             isExpanded ? null : c.complaint_id
//                           )
//                         }
//                       >
//                         {c.complaint_id}
//                       </td>
//                       <td className="border p-2">{currentStatus}</td>
//                       <td className="border p-2">
//                         <select
//                           value={editedStatus}
//                           onChange={(e) =>
//                             handleStatusChange(
//                               c.complaint_id,
//                               e.target.value
//                             )
//                           }
//                           className="border border-gray-300 rounded px-2 py-1 mr-2"
//                         >
//                           <option value="Pending">Pending</option>
//                           <option value="In Progress">In Progress</option>
//                           <option value="Resolved">Resolved</option>
//                         </select>
//                         {editedStatus !== currentStatus && (
//                           <button
//                             onClick={() =>
//                               handleSaveStatus(c.complaint_id)
//                             }
//                             className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
//                           >
//                             Save
//                           </button>
//                         )}
//                       </td>
//                     </tr>

//                     {isExpanded && (
//                       <tr>
//                         <td colSpan="3" className="border p-4 bg-gray-50">
//                           <div className="flex flex-col md:flex-row justify-between gap-6">
//                             <div className="flex-1 space-y-3">
//                               <p>
//                                 <strong>Name:</strong> {c.citizen_name}
//                               </p>

//                               <div>
//                                 <label className="font-semibold block">
//                                   Description:
//                                 </label>
//                                 <textarea
//                                   value={editedDesc}
//                                   onChange={(e) =>
//                                     handleDescriptionChange(
//                                       c.complaint_id,
//                                       e.target.value
//                                     )
//                                   }
//                                   className="border w-full mt-1 p-2 rounded"
//                                   rows={2}
//                                 />
//                                 {editedDesc !== c.description && (
//                                   <button
//                                     onClick={() =>
//                                       handleSaveDescription(c.complaint_id)
//                                     }
//                                     className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
//                                   >
//                                     Save Description
//                                   </button>
//                                 )}
//                               </div>

//                               <p>
//                                 <strong>Department:</strong> {c.department}
//                               </p>

//                               <div>
//                                 <label className="font-semibold block">
//                                   Address:
//                                 </label>
//                                 <textarea
//                                   value={editedAddress}
//                                   onChange={(e) =>
//                                     handleAddressChange(
//                                       c.complaint_id,
//                                       e.target.value
//                                     )
//                                   }
//                                   className="border w-full mt-1 p-2 rounded"
//                                   rows={2}
//                                 />
//                                 {editedAddress !== c.address && (
//                                   <button
//                                     onClick={() =>
//                                       handleSaveAddress(c.complaint_id)
//                                     }
//                                     className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
//                                   >
//                                     Save Address
//                                   </button>
//                                 )}
//                               </div>

//                               <p>
//                                 <strong>Date:</strong>{" "}
//                                 {new Date(
//                                   c.created_at
//                                 ).toLocaleString()}
//                               </p>
//                             </div>

//                             <div className="flex items-start">
//                               <a
//                                 href={c.image_url}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
//                               >
//                                 View Photo
//                               </a>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 );
//               })
//             ) : (
//               <tr>
//                 <td colSpan="3" className="text-center border p-4">
//                   No complaints found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default OfficialDashboard;
import React, { useEffect, useState } from "react";
import axios from "axios";

const OfficialDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [editedStatuses, setEditedStatuses] = useState({});
  const [editedDescriptions, setEditedDescriptions] = useState({});
  const [editedAddresses, setEditedAddresses] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");
  const department = localStorage.getItem("department");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/complaints/all?department=${department}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setComplaints(res.data);
      } catch (err) {
        console.error("Error fetching complaints:", err);
      }
    };
    fetchComplaints();
  }, [token, department]);

  const handleStatusChange = (id, newStatus) => {
    setEditedStatuses((prev) => ({ ...prev, [id]: newStatus }));
  };

  const handleDescriptionChange = (id, value) => {
    setEditedDescriptions((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddressChange = (id, value) => {
    setEditedAddresses((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveStatus = async (id) => {
    const newStatus = editedStatuses[id];
    try {
      await axios.put(
        `http://localhost:5000/api/complaints/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComplaints((prev) =>
        prev.map((c) =>
          c.complaint_id === id ? { ...c, status: newStatus } : c
        )
      );
      setEditedStatuses((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      alert("Status updated successfully!");
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    }
  };

  const handleSaveDescription = async (id) => {
    const newDesc = editedDescriptions[id];
    try {
      await axios.put(
        `http://localhost:5000/api/complaints/${id}/description`,
        { description: newDesc },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComplaints((prev) =>
        prev.map((c) =>
          c.complaint_id === id ? { ...c, description: newDesc } : c
        )
      );
      setEditedDescriptions((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      alert("Description updated successfully!");
    } catch (err) {
      console.error("Error updating description:", err);
      alert("Failed to update description.");
    }
  };

  const handleSaveAddress = async (id) => {
    const newAddress = editedAddresses[id];
    try {
      await axios.put(
        `http://localhost:5000/api/complaints/${id}/address`,
        { address: newAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComplaints((prev) =>
        prev.map((c) =>
          c.complaint_id === id ? { ...c, address: newAddress } : c
        )
      );
      setEditedAddresses((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      alert("Address updated successfully!");
    } catch (err) {
      console.error("Error updating address:", err);
      alert("Failed to update address.");
    }
  };

  const filteredComplaints = complaints.filter(
    (c) =>
      searchQuery.trim() === "" ||
      c.complaint_id.toString() === searchQuery.trim()
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Department Complaints</h1>

      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search by Complaint ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />
      </div>

      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Complaint ID</th>
              <th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.length > 0 ? (
              filteredComplaints.map((c) => {
                const currentStatus = c.status || "Pending";
                const editedStatus =
                  editedStatuses[c.complaint_id] ?? currentStatus;
                const editedDesc =
                  editedDescriptions[c.complaint_id] ?? c.description;
                const editedAddress =
                  editedAddresses[c.complaint_id] ?? c.address;
                const isExpanded = expandedId === c.complaint_id;

                return (
                  <React.Fragment key={c.complaint_id}>
                    <tr className="hover:bg-gray-50">
                      <td
                        className="border p-2 cursor-pointer text-blue-600 underline"
                        onClick={() =>
                          setExpandedId(isExpanded ? null : c.complaint_id)
                        }
                      >
                        {c.complaint_id}
                      </td>
                      <td className="border p-2">{currentStatus}</td>
                      <td className="border p-2">
                        <select
                          value={editedStatus}
                          onChange={(e) =>
                            handleStatusChange(c.complaint_id, e.target.value)
                          }
                          className="border border-gray-300 rounded px-2 py-1 mr-2"
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
                            Save Status
                          </button>
                        )}
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr>
                        <td colSpan="3" className="border p-4 bg-gray-50">
                          <div className="flex flex-col md:flex-row justify-between gap-6">
                            <div className="flex-1 space-y-3">
                              <p>
                                <strong>Name:</strong> {c.citizen_name}
                              </p>

                              <div>
                                <label className="font-semibold block">
                                  Description:
                                </label>
                                <textarea
                                  value={editedDesc}
                                  onChange={(e) =>
                                    handleDescriptionChange(
                                      c.complaint_id,
                                      e.target.value
                                    )
                                  }
                                  className="border w-full mt-1 p-2 rounded"
                                  rows={2}
                                />
                                {editedDesc !== c.description && (
                                  <button
                                    onClick={() =>
                                      handleSaveDescription(c.complaint_id)
                                    }
                                    className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                  >
                                    Save Description
                                  </button>
                                )}
                              </div>

                              <div>
                                <label className="font-semibold block">
                                  Address:
                                </label>
                                <textarea
                                  value={editedAddress}
                                  onChange={(e) =>
                                    handleAddressChange(
                                      c.complaint_id,
                                      e.target.value
                                    )
                                  }
                                  className="border w-full mt-1 p-2 rounded"
                                  rows={2}
                                />
                                {editedAddress !== c.address && (
                                  <button
                                    onClick={() =>
                                      handleSaveAddress(c.complaint_id)
                                    }
                                    className="mt-2 bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                                  >
                                    Save Address
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan="3" className="border p-4 text-center">
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
