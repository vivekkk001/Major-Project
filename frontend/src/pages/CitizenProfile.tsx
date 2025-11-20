import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const CitizenProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/citizen/me`, {
          withCredentials: true, // Required for JWT cookie auth
        });

        setProfile(res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <Navbar />
        <div className="flex justify-center items-center h-screen">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <p>No profile found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navbar />

      <div className="relative px-6 py-24">
        <div className="max-w-lg mx-auto glass p-8 rounded-2xl shadow-lg border border-white/10">

          {/* Avatar */}
          <div className="text-center mb-8">
            <div className="relative mb-6">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center text-white text-2xl font-bold mx-auto">
                {profile.name?.charAt(0)?.toUpperCase()}
              </div>
            </div>

            <h1 className="text-3xl font-bold gradient-text mb-2">Your Profile</h1>
            <p className="text-gray-400">Your account information</p>
          </div>

          {/* Profile Details */}
          <div className="space-y-6">
            <Detail label="Full Name" value={profile.name} />
            <Detail label="Email" value={profile.email} />
            <Detail label="Phone" value={profile.phone} />
            <Detail label="Address" value={profile.address} />
            <Detail
              label="Member Since"
              value={new Date(profile.created_at).toLocaleDateString()}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .glass {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
        }
        .gradient-text {
          background: linear-gradient(135deg, #14b8a6, #06b6d4, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-400">{label}</p>
    <p className="text-lg font-semibold">{value}</p>
  </div>
);

export default CitizenProfile;
