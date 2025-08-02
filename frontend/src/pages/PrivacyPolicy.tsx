import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden text-white">
      <div className="min-h-screen px-4 py-10 flex flex-col items-center justify-center">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-full mb-8 transition duration-200 shadow-md"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </button>

        <div className="max-w-4xl mx-auto bg-black bg-opacity-60 p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-teal-400">Privacy Policy</h1>
          <p className="mb-4">Effective Date: August 1, 2024</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">1. Introduction</h2>
          <p className="mb-4">
            Welcome to <strong>Smart Civic</strong>, a grievance management platform. Your privacy is
            important to us, and we are committed to protecting your personal information.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">2. Information We Collect</h2>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Personal Information: Name, Email, etc.</li>
            <li>Complaint Details, Photos, Geolocation, Device Info</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Complaint tracking and classification</li>
            <li>Sending updates and performance analysis</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">4. Contact Us</h2>
          <p>
            📧{' '}
            <a
              href="mailto:contact@smartcivic.tech"
            >
              contact@smartcivic.tech
            </a>
            <br />
            📞{' '}
            <a
              href="tel:+919483913777"
            >
              +91 9483913777
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
