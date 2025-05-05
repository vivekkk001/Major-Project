import React, { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

const ComplaintForm = () => {
  const [form, setForm] = useState({ description: "", image: null, location: { latitude: "", longitude: "" } });
  const [loading, setLoading] = useState(false);

  // Handle text field changes
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: URL.createObjectURL(file) }); // Show the image preview
    }
  };

  // Fetch user's location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setForm(prevState => ({
            ...prevState,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          }));
        },
        error => {
          alert("Location access denied.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Handle form submission
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("description", form.description);
    formData.append("latitude", form.location.latitude);
    formData.append("longitude", form.location.longitude);
    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      await axios.post(`${API}/api/complaints/create`, formData, { withCredentials: true });
      alert("Complaint submitted");
      setForm({ description: "", image: null, location: { latitude: "", longitude: "" } });
    } catch (err) {
      alert("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold text-indigo-600 mb-4">Submit a Complaint</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="input w-full h-32 resize-none"
          name="description"
          placeholder="Describe your issue..."
          value={form.description}
          onChange={handleChange}
          required
        />

        {/* Image Upload Option */}
        <div className="mt-4">
          <label htmlFor="image-upload" className="btn-primary w-full py-2 text-center">
            Choose Image (Gallery or Camera)
          </label>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Display image preview */}
        {form.image && (
          <div className="mt-4">
            <img src={form.image} alt="Uploaded" className="w-48 h-48 object-cover rounded" />
          </div>
        )}

        {/* Get Location Button */}
        <button
          type="button"
          onClick={getLocation}
          className="btn-primary mt-4 w-full"
        >
          Get Location
        </button>

        {/* Displaying the location */}
        {form.location.latitude && form.location.longitude && (
          <p className="mt-4 text-gray-600">
            Location: Latitude: {form.location.latitude}, Longitude: {form.location.longitude}
          </p>
        )}

        <button className="btn-primary mt-6 w-full" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
