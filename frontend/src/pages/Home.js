import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // This can be used to check if the user is logged in, for example:
    // if (!user) {
    //   navigate("/login");
    // }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-semibold text-indigo-600 mb-6">Welcome to the Complaint Management System</h1>
        <p className="text-lg text-gray-600 mb-4">This is your dashboard where you can manage complaints and view your submissions.</p>
        
        <div className="mt-6 space-x-4">
          <button
            onClick={() => navigate("/complaints")}
            className="btn-primary px-6 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            View Complaints
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="btn-primary px-6 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            My Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
