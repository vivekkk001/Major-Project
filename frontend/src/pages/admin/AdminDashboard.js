import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [deptName, setDeptName] = useState("");
  const [officialData, setOfficialData] = useState({
    official_id: "",
    email: "",
    password: "",
    department_id: "",
  });

  useEffect(() => {
    axios.get("/api/admin/users").then(res => setUsers(res.data));
    axios.get("/api/admin/departments").then(res => setDepartments(res.data));
  }, []);

  const createDepartment = async () => {
    await axios.post("/api/admin/departments", { name: deptName });
    setDeptName("");
    const res = await axios.get("/api/admin/departments");
    setDepartments(res.data);
  };

  const registerOfficial = async () => {
    await axios.post("/api/admin/officials", officialData);
    setOfficialData({ official_id: "", email: "", password: "", department_id: "" });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <section className="mb-6">
        <h2 className="font-semibold">Users</h2>
        <ul>{users.map(u => <li key={u.id}>{u.name} - {u.email}</li>)}</ul>
      </section>

      <section className="mb-6">
        <h2 className="font-semibold">Departments</h2>
        <ul>{departments.map(d => <li key={d.id}>{d.name}</li>)}</ul>
        <input
          type="text"
          value={deptName}
          onChange={e => setDeptName(e.target.value)}
          className="border p-1"
        />
        <button onClick={createDepartment} className="ml-2 bg-blue-600 text-white px-3 py-1">Add Department</button>
      </section>

      <section>
        <h2 className="font-semibold">Register Official</h2>
        <input
          placeholder="Official ID"
          value={officialData.official_id}
          onChange={e => setOfficialData({ ...officialData, official_id: e.target.value })}
          className="border p-1 mr-2"
        />
        <input
          placeholder="Email"
          value={officialData.email}
          onChange={e => setOfficialData({ ...officialData, email: e.target.value })}
          className="border p-1 mr-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={officialData.password}
          onChange={e => setOfficialData({ ...officialData, password: e.target.value })}
          className="border p-1 mr-2"
        />
        <select
          value={officialData.department_id}
          onChange={e => setOfficialData({ ...officialData, department_id: e.target.value })}
          className="border p-1 mr-2"
        >
          <option value="">Select Dept</option>
          {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <button onClick={registerOfficial} className="bg-green-600 text-white px-3 py-1">Register</button>
      </section>
    </div>
  );
};

export default AdminDashboard;
