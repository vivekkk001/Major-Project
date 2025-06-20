// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const OfficialLogin = () => {
//   const [official_id, setOfficialId] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("http://localhost:5000/api/official/login", {
//         official_id,
//         password
//       });
//       alert(res.data.message);
//       navigate("/official-dashboard");
//     } catch (err) {
//       alert("Login failed");
//       console.error(err);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen">
//       <form onSubmit={handleLogin} className="bg-white p-8 shadow-md rounded">
//         <h2 className="text-xl font-bold mb-4">Official Login</h2>
//         <input
//           type="text"
//           placeholder="Official ID"
//           value={official_id}
//           onChange={(e) => setOfficialId(e.target.value)}
//           className="block mb-4 w-full border p-2"
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="block mb-4 w-full border p-2"
//           required
//         />
//         <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default OfficialLogin;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OfficialLogin = () => {
  const [official_id, setOfficialId] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch available departments from the server
    const fetchDepartments = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/departments");
        setDepartments(res.data);
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };
    fetchDepartments();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/official/login", {
        official_id,
        password,
        department,
      });

      // Store token and department in local storage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("department", department);

      alert(res.data.message);
      navigate("/official-dashboard");
    } catch (err) {
      alert("Login failed");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleLogin} className="bg-white p-8 shadow-md rounded">
        <h2 className="text-xl font-bold mb-4">Official Login</h2>
        <input
          type="text"
          placeholder="Official ID"
          value={official_id}
          onChange={(e) => setOfficialId(e.target.value)}
          className="block mb-4 w-full border p-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block mb-4 w-full border p-2"
          required
        />
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="block mb-4 w-full border p-2"
          required
        >
          <option value="">Select Department</option>
          <option value="Road Maintenance">Road Maintenance</option>
          <option value="Water Supply">Water Supply</option>
          <option value="Sanitation">Sanitation</option>
          <option value="Sewage">Sewage</option>
          <option value="Parks and Recreation">Parks and Recreation</option>
          <option value="Public Transportation">Public Transportation</option>
          <option value="Electrical Department">Electrical Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.name}>{dept.name}</option>
          ))}
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default OfficialLogin;
