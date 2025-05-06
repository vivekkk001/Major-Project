import React, { useEffect, useState } from "react";
import axios from "axios";

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    axios.get("/api/admin/departments")
      .then(res => setDepartments(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Department Management</h2>
      <ul>
        {departments.map(dept => (
          <li key={dept.id} className="border-b py-2">
            {dept.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DepartmentManagement;
