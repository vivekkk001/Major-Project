import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, Loader, MapPin, Navigation, Send, AlertCircle, X, RotateCcw, Sparkles, RefreshCw, Shield } from 'lucide-react';

const ComplaintForm = () => {
  const [description, setDescription] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [capturedImage, setCapturedImage] = useState(null);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [message, setMessage] = useState('');
  const [isBlurry, setIsBlurry] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // CAPTCHA States
  const [captchaSvg, setCaptchaSvg] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaLoading, setCaptchaLoading] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const debounceTimer = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  // Load CAPTCHA on component mount
  useEffect(() => {
    loadCaptcha();
  }, []);

  // Load CAPTCHA Function
  const loadCaptcha = async () => {
    setCaptchaLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/complaints/captcha`, {
        credentials: 'include',
      });
      const svgText = await response.text();
      setCaptchaSvg(svgText);
      setCaptchaInput('');
    } catch (error) {
      console.error('Failed to load CAPTCHA:', error);
      setMessage('Failed to load CAPTCHA. Please refresh the page.');
    } finally {
      setCaptchaLoading(false);
    }
  };

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

  const handleAIHelp = async (text) => {
    if (text.length <= 3) {
      setSuggestions([]);
      return;
    }

    setAiLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/complaints/generate-suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ keyword: text })
      });

      const data = await response.json();
      if (data && data.suggestions) {
        setSuggestions(data.suggestions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("AI Error:", error);
      setSuggestions([]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (value.length > 3) {
      debounceTimer.current = setTimeout(() => {
        handleAIHelp(value);
      }, 1000);
    } else {
      setSuggestions([]);
    }
  };

  const applySuggestion = (suggestion) => {
    setDescription(suggestion);
    setSuggestions([]);
  };

  const checkImageBlur = (imageData, width, height) => {
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
    } catch (error) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaInput || captchaInput.trim() === '') {
      setMessage('Please enter the CAPTCHA code.');
      return;
    }

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
    formData.append('latitude', location.lat.toString());
    formData.append('longitude', location.lng.toString());
    formData.append('captcha', captchaInput);

    try {
      const res = await fetch(`${API_BASE_URL}/api/complaints`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await res.json();

      if (res.status === 201) {
        setMessage('Complaint submitted successfully! Redirecting...');

        // Wait 1.5 seconds to show success message, then redirect
        setTimeout(() => {
          window.location.href = `${import.meta.env.VITE_FRONTEND_URL}/my-complaints`;
        }, 1500);
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      const errorMsg = err.message || 'Something went wrong.';
      setMessage(errorMsg);

      if (errorMsg.includes('CAPTCHA')) {
        loadCaptcha();
      }
      setLoading(false);
    }
  };

  const particles = Array.from({ length: 50 }, (_, i) => (
    <div
      key={i}
      className="particle"
      style={{
        left: `${Math.random() * 100}%`,
        width: `${Math.random() * 4 + 2}px`,
        height: `${Math.random() * 4 + 2}px`,
        animationDelay: `${Math.random() * 15}s`,
        animationDuration: `${Math.random() * 10 + 10}s`
      }}
    />
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {particles}
        <div className="blob absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-teal-400/20 to-cyan-400/20 rounded-full morph"></div>
        <div className="blob absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full morph"></div>
        <div className="blob absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-teal-400/5 to-cyan-400/5 rounded-full morph"></div>
      </div>

      <div className="relative max-w-2xl mx-auto px-6 py-24">
        <div className="glass rounded-2xl p-8 shadow-2xl glow backdrop-blur-xl border border-white/10">
          <div className="text-center mb-8">
            <div className="relative mb-6">
              <Send className="h-12 w-12 text-teal-400 mx-auto float" />
              <div className="absolute inset-0 rounded-full bg-teal-400 opacity-20 blur-lg"></div>
            </div>
            <h2 className="text-3xl font-bold gradient-text mb-2">File a Complaint</h2>
            <p className="text-gray-400">Help us improve your community by reporting issues</p>
          </div>

          {message && (
            <div className={`mb-6 px-4 py-3 rounded-lg glass border ${message.includes('successfully') || message.includes('fetched')
              ? 'border-green-400/30 bg-green-400/10 text-green-300'
              : 'border-red-400/30 bg-red-400/10 text-red-300'
              }`}>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{message}</span>
              </div>
            </div>
          )}

          <div className="space-y-8">
            {/* Description with AI Help */}
            <div className="space-y-2">
              <label className="text-lg font-medium text-white flex items-center space-x-2">
                <span>Complaint Description</span>
                <span className="text-red-400">*</span>
                {aiLoading && <Sparkles className="h-4 w-4 text-teal-400 animate-pulse" />}
              </label>
              <textarea
                value={description}
                onChange={handleDescriptionChange}
                rows={4}
                required
                placeholder="Type a keyword like 'pothole', 'garbage', 'streetlight'..."
                className="w-full p-4 rounded-lg glass border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 transition-all backdrop-blur-sm"
              />

              {suggestions.length > 0 && (
                <div className="glass border border-purple-400/30 bg-purple-400/10 p-4 rounded-lg space-y-3 animate-fadeIn">
                  <div className="space-y-2">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => applySuggestion(suggestion)}
                        className="w-full p-3 text-left glass rounded-lg text-sm text-gray-300 hover:bg-purple-400/20 hover:border-purple-400/50 border border-white/10 transition-all hover-lift group"
                      >
                        <span className="flex items-start gap-2">
                          <span className="text-purple-400 font-bold">{index + 1}.</span>
                          <span className="group-hover:text-white transition-colors">{suggestion}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Camera Section */}
            <div className="space-y-4">
              <label className="text-lg font-medium text-white flex items-center space-x-2">
                <Camera className="h-5 w-5" />
                <span>Capture Image</span>
                <span className="text-red-400">*</span>
              </label>

              {!capturedImage && !showCamera && (
                <button
                  type="button"
                  onClick={startCamera}
                  className="w-full py-4 glass glow rounded-lg flex items-center justify-center gap-3 font-semibold text-teal-400 hover:bg-teal-400 hover:text-white transition-all hover-lift ripple group"
                >
                  <Camera className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  Open Camera
                </button>
              )}

              {showCamera && (
                <div className="relative space-y-4">
                  <div className="relative rounded-lg overflow-hidden border border-white/20">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-64 object-cover bg-black"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="flex-1 py-3 glass glow rounded-lg flex items-center justify-center gap-2 font-semibold text-green-400 hover:bg-green-400 hover:text-white transition-all hover-lift group"
                    >
                      <Camera className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      Capture Photo
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="flex-1 py-3 glass rounded-lg flex items-center justify-center gap-2 font-semibold text-red-400 hover:bg-red-400 hover:text-white transition-all hover-lift group"
                    >
                      <X className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {capturedImage && (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden border border-white/20">
                    <img
                      src={capturedImage}
                      alt="Captured evidence"
                      className="w-full rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-3 right-3 p-2 bg-red-600/80 hover:bg-red-600 rounded-full backdrop-blur-sm transition-all hover-lift group"
                    >
                      <X className="h-4 w-4 text-white group-hover:scale-110 transition-transform" />
                    </button>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                  </div>

                  {isBlurry && (
                    <div className="glass border border-yellow-400/30 bg-yellow-400/10 p-3 rounded-lg">
                      <p className="text-yellow-300 text-sm flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        The image appears blurry. Consider retaking for better quality.
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={retakePhoto}
                    className="w-full py-3 glass rounded-lg flex items-center justify-center gap-2 text-yellow-400 hover:bg-yellow-400 hover:text-white transition-all hover-lift ripple group"
                  >
                    <RotateCcw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
                    Retake Photo
                  </button>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Location Section */}
            <div className="space-y-4">
              <label className="text-lg font-medium text-white flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Location</span>
                <span className="text-red-400">*</span>
              </label>

              <button
                type="button"
                onClick={handleLocation}
                disabled={locationLoading}
                className="w-full py-4 glass glow rounded-lg flex items-center justify-center gap-3 font-semibold text-teal-400 hover:bg-teal-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover-lift ripple group"
              >
                {locationLoading ? (
                  <Loader className="animate-spin h-5 w-5" />
                ) : (
                  <Navigation className="h-5 w-5 group-hover:scale-110 transition-transform" />
                )}
                {locationLoading ? 'Getting Location...' : 'Get Current Location'}
              </button>

              {location.lat && location.lng && (
                <div className="glass border border-teal-400/30 bg-teal-400/10 p-4 rounded-lg">
                  <div className="flex items-center space-x-3 text-teal-300">
                    <MapPin className="h-5 w-5 flex-shrink-0" />
                    <div className="text-sm">
                      <div className="font-medium">Location Captured</div>
                      <div className="text-teal-400">
                        {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CAPTCHA Section */}
            <div className="space-y-4">
              <label className="text-lg font-medium text-white flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Verify You're Human</span>
                <span className="text-red-400">*</span>
              </label>

              <div className="glass border border-white/20 p-4 rounded-lg space-y-4">
                <div className="flex items-center gap-4">
                  <div
                    className="flex-1 bg-slate-800 rounded-lg p-3 flex items-center justify-center border border-white/10"
                    dangerouslySetInnerHTML={{ __html: captchaSvg }}
                  />
                  <button
                    type="button"
                    onClick={loadCaptcha}
                    disabled={captchaLoading}
                    className="p-3 glass rounded-lg text-teal-400 hover:bg-teal-400 hover:text-white transition-all hover-lift group disabled:opacity-50"
                    title="Refresh CAPTCHA"
                  >
                    <RefreshCw className={`h-5 w-5 ${captchaLoading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-300`} />
                  </button>
                </div>

                <input
                  type="text"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  placeholder="Enter the code shown above"
                  required
                  className="w-full p-4 rounded-lg glass border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 transition-all backdrop-blur-sm text-center text-lg font-mono tracking-wider"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !description || !capturedImage || !location.lat || !location.lng || !captchaInput}
              className="w-full py-4 glass-dark glow rounded-lg flex items-center justify-center gap-3 font-semibold text-lg text-teal-400 hover:bg-teal-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover-lift ripple group"
            >
              {loading ? (
                <Loader className="animate-spin h-5 w-5" />
              ) : (
                <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              )}
              {loading ? 'Submitting Complaint...' : 'Submit Complaint'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .particle {
          position: absolute;
          background: linear-gradient(45deg, #14b8a6, #06b6d4);
          border-radius: 50%;
          opacity: 0.6;
          animation: float infinite ease-in-out;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-100px) rotate(180deg); opacity: 0.2; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .blob {
          animation: morph 8s ease-in-out infinite;
        }

        @keyframes morph {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: rotate(0deg); }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; transform: rotate(180deg); }
        }

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

        .float {
          animation: floatIcon 3s ease-in-out infinite;
        }

        @keyframes floatIcon {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .morph {
          animation: morph 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ComplaintForm;