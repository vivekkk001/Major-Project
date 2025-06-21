import React, { useEffect, useState } from "react";
import axios from "axios";

interface Profile {
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
}

const CitizenProfile: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editable, setEditable] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState<boolean>(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/citizen/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setEditable(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        alert("Failed to fetch profile. Please check authentication.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleUpdate = async () => {
    const confirmation = prompt("Type 'save' to confirm profile update:");
    if (confirmation?.toLowerCase() !== "save") {
      alert("Update cancelled.");
      return;
    }

    try {
      const res = await axios.put(
        "http://localhost:5000/api/citizen/update-profile",
        {
          name: editable.name,
          phone: editable.phone,
          address: editable.address,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("✅ Profile updated successfully!");
      setProfile(res.data.citizen);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("❌ Failed to update profile.");
    }
  };

  if (loading) return <p className="text-white text-center mt-20">Loading profile...</p>;
  if (!profile) return <p className="text-red-400 text-center mt-20">No profile found.</p>;

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-20 text-white">
      <div className="max-w-2xl mx-auto glass p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-slate-800 border border-gray-600 text-white"
              value={editable.name}
              onChange={(e) => setEditable({ ...editable, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Email (read-only)</label>
            <input
              type="email"
              className="w-full p-2 rounded bg-slate-700 border border-gray-600 text-gray-400 cursor-not-allowed"
              value={editable.email}
              disabled
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Phone</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-slate-800 border border-gray-600 text-white"
              value={editable.phone}
              onChange={(e) => setEditable({ ...editable, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Address</label>
            <textarea
              rows={3}
              className="w-full p-2 rounded bg-slate-800 border border-gray-600 text-white"
              value={editable.address}
              onChange={(e) => setEditable({ ...editable, address: e.target.value })}
            />
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleUpdate}
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-2 rounded"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenProfile;
