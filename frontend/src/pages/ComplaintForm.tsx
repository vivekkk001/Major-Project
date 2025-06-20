import React, { useState } from 'react';
import axios from 'axios';
import { Camera, Loader, MapPin, Navigation, Send, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar'; // ✅ using your existing Navbar

const ComplaintForm = () => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [location, setLocation] = useState({ lat: null as number | null, lng: null as number | null });
  const [message, setMessage] = useState('');
  const [isBlurry, setIsBlurry] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  // 📷 Check if image is blurry
  const checkImageBlur = (file: File) => {
    return new Promise<boolean>((resolve) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === 'string') {
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

            let sum = 0;
            for (let i = 0; i < imageData.length; i += 4) {
              const gray = 0.299 * imageData[i] + 0.587 * imageData[i + 1] + 0.114 * imageData[i + 2];
              sum += gray;
            }
            const mean = sum / (imageData.length / 4);

            let variance = 0;
            for (let i = 0; i < imageData.length; i += 4) {
              const gray = 0.299 * imageData[i] + 0.587 * imageData[i + 1] + 0.114 * imageData[i + 2];
              variance += (gray - mean) ** 2;
            }

            const stddev = Math.sqrt(variance / (imageData.length / 4));
            resolve(stddev < 20); // Threshold for blurriness
          };
          img.src = reader.result;
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const blurry = await checkImageBlur(file);
      setImage(file);
      setIsBlurry(blurry);
    }
  };

  const handleLocation = () => {
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setMessage('Location fetched successfully!');
        setLocationLoading(false);
      },
      (err) => {
        console.error(err);
        setMessage('Failed to get location.');
        setLocationLoading(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !image || !location.lat || !location.lng) {
      setMessage('Please fill all required fields.');
      return;
    }

    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('description', description);
    formData.append('image', image);
    formData.append('latitude', location.lat!.toString());
    formData.append('longitude', location.lng!.toString());

    try {
      const res = await axios.post('http://localhost:5000/api/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      if (res.status === 201) {
        setMessage('✅ Complaint submitted successfully!');
        setDescription('');
        setImage(null);
        setLocation({ lat: null, lng: null });
        setIsBlurry(false);
        (document.getElementById('image') as HTMLInputElement).value = '';
      }
    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-950 text-white">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-24">
        <div className="glass border border-gray-700 p-8 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold mb-6">📢 File a Complaint</h2>

          {message && (
            <div className={`mb-6 px-4 py-3 rounded ${message.includes('✅') ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-lg block mb-2">Complaint Description <span className="text-red-400">*</span></label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                placeholder="Describe the issue..."
                className="w-full p-4 rounded-lg bg-gray-800 border border-gray-600 text-white"
              />
            </div>

            <div>
              <label className="text-lg block mb-2">Capture Image <span className="text-red-400">*</span></label>
              <input
                type="file"
                id="image"
                accept="image/*"
                capture="environment"
                required
                onChange={handleImageChange}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
              />
              {isBlurry && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" /> The image appears blurry. Consider retaking it.
                </p>
              )}
            </div>

            <div>
              <label className="text-lg block mb-2">Location <span className="text-red-400">*</span></label>
              <button
                type="button"
                onClick={handleLocation}
                disabled={locationLoading}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 rounded-lg flex items-center justify-center gap-2"
              >
                {locationLoading ? <Loader className="animate-spin h-5 w-5" /> : <Navigation className="h-5 w-5" />}
                Get Current Location
              </button>
              {location.lat && location.lng && (
                <div className="mt-3 p-3 rounded bg-gray-800 border border-gray-600">
                  <MapPin className="inline mr-2 text-teal-400" />
                  Latitude: {location.lat.toFixed(6)}, Longitude: {location.lng.toFixed(6)}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 rounded-lg flex items-center justify-center gap-2 font-semibold text-lg"
            >
              {loading ? <Loader className="animate-spin h-5 w-5" /> : <Send className="h-5 w-5" />}
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComplaintForm;
