import React from 'react';
import { ArrowLeft, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomerSupport = () => {
  const navigate = useNavigate();

  const team = [
    {
      name: 'Sanjay G Kamath',
      email: 'sanjaykamath6969@gmail.com',
      phone: '+91 9483913777',
    },
    {
      name: 'Vivek D',
      email: 'vivekkulal905@gmail.com',
      phone: '+91 9108969117',
    },
    {
      name: 'Varsha Nayak K',
      email: 'kvarshanayak@gmail.com',
      phone: '+91 8088214804',
    },
  ];


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

        <div className="max-w-3xl mx-auto bg-black bg-opacity-60 p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-teal-400 text-center">Customer Support</h1>

          <p className="mb-6 text-center">
            We're here to help! Reach out to any of our developers for assistance with the Smart Civic platform.
          </p>

          <div className="space-y-6">
            {team.map((dev, index) => (
              <div key={index} className="bg-slate-800 p-4 rounded-md shadow-md">
                <h2 className="text-xl font-semibold text-teal-300">{dev.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <Mail className="text-teal-400" />
                  <a href={`mailto:${dev.email}`} >
                    {dev.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="text-teal-400" />
                  <a href={`tel:${dev.phone.replace(/\s+/g, '')}`} >
                    {dev.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-center text-gray-300">
            Support available Monday to Friday, 9:00 AM – 6:00 PM IST.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport;
