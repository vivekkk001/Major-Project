import React, { useState } from 'react';
import axios from 'axios';

const ComplaintForm = () => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState({ lat: null, long: null });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Get current location (latitude and longitude)
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, long: longitude });
          console.log(`Location fetched: Latitude = ${latitude}, Longitude = ${longitude}`);
        },
        (error) => {
          setMessage('Unable to retrieve location. Please ensure location services are enabled.');
        }
      );
    } else {
      setMessage('Geolocation is not supported by this browser.');
    }
  };

  // Handle description change
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  // Submit complaint form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!description || !image || !location.lat || !location.long) {
      setMessage('Please provide description, image, and location.');
      return;
    }

    setLoading(true);
    setMessage('');

    // Prepare FormData for submission
    const formData = new FormData();
    formData.append('description', description);
    formData.append('image', image);
    formData.append('lat', location.lat);
    formData.append('long', location.long);

    // Log formData to check its content
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    try {
      // Make the API request to submit the complaint
      const response = await axios.post('http://localhost:5000/api/complaints', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, // Include cookies (e.g., for authentication)
      });

      // Handle success
      if (response.status === 200) {
        setMessage('Complaint submitted successfully!');
        setDescription('');
        setImage(null);
        setLocation({ lat: null, long: null });
      } else {
        setMessage('Error submitting complaint');
      }
    } catch (error) {
      // Handle error
      console.error('Error submitting complaint:', error.response ? error.response.data : error.message);
      setMessage('There was an error submitting your complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Submit a Complaint</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-lg font-medium text-gray-700">Complaint Description:</label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter complaint description"
            value={description}
            onChange={handleDescriptionChange}
            required
            className="mt-2 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Image */}
        <div>
          <label htmlFor="image" className="block text-lg font-medium text-gray-700">Complaint Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="mt-2 block w-full text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Get Location Button */}
        <div>
          <button 
            type="button" 
            onClick={handleGetLocation}
            className="w-full py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all"
          >
            Get Location
          </button>
        </div>

        {/* Location Display */}
        {location.lat && location.long && (
          <div className="mt-4 text-center">
            <p className="text-lg font-medium text-gray-700">
              Latitude: {location.lat}, Longitude: {location.long}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 transition-all"
          >
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </div>
      </form>

      {/* Message */}
      {message && (
        <p className={`mt-4 text-center font-semibold ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ComplaintForm;
