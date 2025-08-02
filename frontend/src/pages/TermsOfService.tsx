import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
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
          <h1 className="text-3xl font-bold mb-4 text-teal-400">Terms of Service</h1>
          <p className="mb-4">Effective Date: August 1, 2024</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using <strong>Smart Civic</strong>, you agree to be bound by these Terms of Service.
            If you do not agree with any part of the terms, you may not use the platform.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">2. Use of Service</h2>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>You must provide accurate information when submitting complaints.</li>
            <li>You are responsible for any content you upload to the platform.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">3. Prohibited Activities</h2>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Submitting false or fraudulent complaints</li>
            <li>Uploading inappropriate, offensive, or misleading content</li>
            <li>Attempting to breach platform security or misuse data</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">4. Modifications to Terms</h2>
          <p className="mb-4">
            We may revise these Terms from time to time. Continued use after changes constitutes
            acceptance of the new terms.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">5. Contact Us</h2>
          <p className="text-teal-300">
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

export default TermsOfService;
