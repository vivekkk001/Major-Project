import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

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
  const [updating, setUpdating] = useState<boolean>(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/citizen/me`, {
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
    
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleUpdate = async () => {
    const confirmation = prompt("Type 'save' to confirm profile update:");
    if (confirmation?.toLowerCase() !== "save") {
      alert("Update cancelled.");
      return;
    }

    setUpdating(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/citizen/update-profile`,
        {
          name: editable.name,
          phone: editable.phone,
          address: editable.address,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Profile updated successfully!");
      setProfile(res.data.citizen || res.data);
      setEditable(res.data.citizen || res.data);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-gray-400 mb-6">Please log in to view your profile.</p>
            <a href="/login" className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded">
              Go to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <p className="text-white text-center">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <p className="text-red-400 text-center">No profile found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="blob absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-teal-400/10 to-cyan-400/10 rounded-full morph"></div>
        <div className="blob absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full morph"></div>
      </div>

      <div className="relative px-6 py-24 text-white">
        <div className="max-w-2xl mx-auto glass p-8 rounded-2xl shadow-2xl glow backdrop-blur-xl border border-white/10">
          <div className="text-center mb-8">
            <div className="relative mb-6">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center text-white text-2xl font-bold mx-auto">
                {profile.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="absolute inset-0 rounded-full bg-teal-400 opacity-20 blur-lg"></div>
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Your Profile</h1>
            <p className="text-gray-400">Manage your account information</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                className="w-full p-4 rounded-lg glass border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 transition-all backdrop-blur-sm"
                value={editable.name || ''}
                onChange={(e) => setEditable({ ...editable, name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address (Read Only)</label>
              <input
                type="email"
                className="w-full p-4 rounded-lg glass border border-white/10 text-gray-400 cursor-not-allowed backdrop-blur-sm"
                value={editable.email || ''}
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
              <input
                type="tel"
                className="w-full p-4 rounded-lg glass border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 transition-all backdrop-blur-sm"
                value={editable.phone || ''}
                onChange={(e) => setEditable({ ...editable, phone: e.target.value })}
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
              <textarea
                rows={4}
                className="w-full p-4 rounded-lg glass border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 transition-all backdrop-blur-sm resize-none"
                value={editable.address || ''}
                onChange={(e) => setEditable({ ...editable, address: e.target.value })}
                placeholder="Enter your address"
              />
            </div>

            <div className="pt-6 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  <span>Member since: </span>
                  <span className="text-teal-400">
                    {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <button
                  onClick={handleUpdate}
                  disabled={updating}
                  className="glass-dark glow px-6 py-3 rounded-lg font-semibold text-teal-400 hover:bg-teal-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover-lift ripple"
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .glass {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .glass-dark {
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .glow {
          box-shadow: 0 0 20px rgba(20, 184, 166, 0.1);
        }

        .glow:hover {
          box-shadow: 0 0 30px rgba(20, 184, 166, 0.2);
        }

        .hover-lift:hover {
          transform: translateY(-2px);
        }

        .ripple {
          position: relative;
          overflow: hidden;
        }

        .ripple:before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .ripple:hover:before {
          width: 300px;
          height: 300px;
        }

        .gradient-text {
          background: linear-gradient(135deg, #14b8a6, #06b6d4, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .blob {
          animation: morph 8s ease-in-out infinite;
        }

        @keyframes morph {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: rotate(0deg); }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; transform: rotate(180deg); }
        }
      `}</style>
    </div>
  );
};

export default CitizenProfile;