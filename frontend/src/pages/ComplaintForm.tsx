import React, { useState, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';
import { Camera, Loader, MapPin, Navigation, Send, AlertCircle, X, RotateCcw } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const ComplaintForm = () => {
  const [description, setDescription] = useState('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [location, setLocation] = useState({ lat: null as number | null, lng: null as number | null });
  const [message, setMessage] = useState('');
  const [isBlurry, setIsBlurry] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play().catch((e) => {
          console.error('Video playback failed:', e);
          setMessage('Camera stream loaded but video playback failed.');
        });
      };
    }
  }, [stream]);

  const checkImageBlur = (imageData: Uint8ClampedArray, width: number, height: number): boolean => {
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
    return stddev < 20;
  };

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMessage('Camera not supported on this device/browser.');
        return;
      }

      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setShowCamera(true);
      setMessage('');
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      let errorMessage = 'Failed to access camera. ';
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera permissions and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera found on this device.';
      } else {
        errorMessage += 'Please check camera permissions.';
      }
      setMessage(errorMessage);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (video.readyState !== video.HAVE_ENOUGH_DATA) {
        setMessage('Please wait for camera to load.');
        return;
      }

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const blurry = checkImageBlur(imageData.data, canvas.width, canvas.height);

      const dataURL = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(dataURL);
      setIsBlurry(blurry);
      stopCamera();

      setMessage(blurry ? 'Image is blurry. Retake for better quality.' : 'Photo captured successfully!');
    }
  }, [stream]);

  const retakePhoto = () => {
    setCapturedImage(null);
    setIsBlurry(false);
    startCamera();
  };

  const removeImage = () => {
    setCapturedImage(null);
    setIsBlurry(false);
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
    if (!description || !capturedImage || !location.lat || !location.lng) {
      setMessage('Please fill all required fields.');
      return;
    }

    setLoading(true);
    setMessage('');

    const response = await fetch(capturedImage);
    const blob = await response.blob();
    const imageFile = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });

    const formData = new FormData();
    formData.append('description', description);
    formData.append('image', imageFile);
    formData.append('latitude', location.lat!.toString());
    formData.append('longitude', location.lng!.toString());

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/complaints`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      if (res.status === 201) {
        navigate('/my-complaints');
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
          <h2 className="text-3xl font-bold mb-6">File a Complaint</h2>

          {message && (
            <div className={`mb-6 px-4 py-3 rounded ${message.includes('') ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Description */}
            <div>
              <label className="text-lg block mb-2">Complaint Description <span className="text-red-400">*</span></label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                placeholder="Describe the issue..."
                className="w-full p-4 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400"
              />
            </div>

            {/* Camera */}
            <div>
              <label className="text-lg block mb-2">Capture Image <span className="text-red-400">*</span></label>

              {!capturedImage && !showCamera && (
                <button
                  type="button"
                  onClick={startCamera}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center gap-2 font-semibold"
                >
                  <Camera className="h-5 w-5" />
                  Open Camera
                </button>
              )}

              {showCamera && (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-64 object-cover rounded-lg bg-black"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="flex-1 py-3 bg-green-600 hover:bg-green-700 rounded-lg flex items-center justify-center gap-2 font-semibold"
                    >
                      <Camera className="h-4 w-4" />
                      Capture Photo
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="flex-1 py-3 bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center gap-2 font-semibold"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {capturedImage && (
                <div className="space-y-3 mt-3">
                  <div className="relative">
                    <img
                      src={capturedImage}
                      alt="Captured"
                      className="w-full rounded-lg border border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {isBlurry && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      The image appears blurry. Consider retaking it.
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={retakePhoto}
                    className="w-full py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Retake Photo
                  </button>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Location */}
            <div>
              <label className="text-lg block mb-2">Location <span className="text-red-400">*</span></label>
              <button
                type="button"
                onClick={handleLocation}
                disabled={locationLoading}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 rounded-lg flex items-center justify-center gap-2"
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 disabled:opacity-50 rounded-lg flex items-center justify-center gap-2 font-semibold text-lg"
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
