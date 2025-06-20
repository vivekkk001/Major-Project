import React, { useState, useRef, useEffect } from 'react';
import { FileText, MapPin, Camera, Send, AlertCircle, X, Navigation } from 'lucide-react';

const ComplaintForm: React.FC = () => {
  const [formData, setFormData] = useState({
    description: '',
    location: '',
    latitude: null as number | null,
    longitude: null as number | null,
    anonymous: false
  });

  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const detectCurrentLocation = () => {
    setIsDetectingLocation(true);
    
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      setIsDetectingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use reverse geocoding to get address
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY`
          );
          
          if (response.ok) {
            const data = await response.json();
            const address = data.results[0]?.formatted || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
            
            setFormData(prev => ({
              ...prev,
              location: address,
              latitude,
              longitude
            }));
          } else {
            // Fallback to coordinates if geocoding fails
            setFormData(prev => ({
              ...prev,
              location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
              latitude,
              longitude
            }));
          }
        } catch (error) {
          // Fallback to coordinates if geocoding fails
          setFormData(prev => ({
            ...prev,
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            latitude,
            longitude
          }));
        }
        
        setIsDetectingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to detect location. Please enter manually or check location permissions.');
        setIsDetectingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const startCamera = async () => {
    try {
      // Try with different camera configurations
      let stream;
      try {
        // First try with back camera
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { min: 640, ideal: 1280 },
            height: { min: 480, ideal: 720 }
          } 
        });
      } catch (backCameraError) {
        console.log('Back camera failed, trying any camera:', backCameraError);
        // Fallback to any available camera
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: {
            width: { min: 640, ideal: 1280 },
            height: { min: 480, ideal: 720 }
          }
        });
      }
      
      streamRef.current = stream;
      setShowCamera(true);
      
      // Wait for DOM update then attach stream
      await new Promise(resolve => setTimeout(resolve, 200));
      
      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready
        await new Promise((resolve, reject) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => resolve(true);
            videoRef.current.onerror = reject;
            videoRef.current.play().catch(reject);
            
            // Timeout fallback
            setTimeout(() => resolve(true), 3000);
          }
        });
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setShowCamera(false);
      alert('Unable to access camera. Please check permissions and try again.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      // Check if video is actually playing and has dimensions
      if (video.videoWidth === 0 || video.videoHeight === 0 || video.readyState < 2) {
        alert('Camera not ready. Please wait for the video to load completely.');
        return;
      }
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        // Draw the video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        
        // Verify we got a valid image (not just black)
        if (imageData.length > 5000) { // Basic check for non-empty image
          setCapturedImages(prev => [...prev, imageData]);
        } else {
          alert('Failed to capture image. Please try again.');
        }
      }
    } else {
      alert('Camera not available. Please close and reopen the camera.');
    }
  };

  const removeImage = (index: number) => {
    setCapturedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    // Check if at least one photo is captured
    if (capturedImages.length === 0) {
      alert('Please capture at least one photo before submitting the complaint.');
      return;
    }
    
    console.log('Complaint submitted:', { 
      ...formData, 
      images: capturedImages,
      timestamp: new Date().toISOString()
    });
    
    // Handle form submission
    alert('Complaint submitted successfully!');
    
    // Reset form
    setFormData({
      description: '',
      location: '',
      latitude: null,
      longitude: null,
      anonymous: false
    });
    setCapturedImages([]);
    stopCamera();
  };

  // Cleanup camera stream on component unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-teal-400/10 to-cyan-400/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full animate-pulse"></div>
      </div>

      <div className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="relative mb-6">
              <FileText className="h-16 w-16 text-teal-400 mx-auto" />
              <div className="absolute inset-0 rounded-full bg-teal-400 opacity-20 blur-lg"></div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">File a Complaint</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Report an issue in your community and help us make it better. Your voice matters.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl">
            <div className="space-y-8">
              {/* Title */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Complaint Description *
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="bg-white/5 backdrop-blur-sm w-full px-4 py-3 rounded-lg border border-gray-600 focus:border-teal-400 focus:outline-none transition-colors text-white placeholder-gray-400"
                  placeholder="Brief description of the issue"
                  required
                />
              </div>

              {/* Location with Auto-detect */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                  Location *
                </label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="bg-white/5 backdrop-blur-sm w-full pl-10 pr-4 py-3 rounded-lg border border-gray-600 focus:border-teal-400 focus:outline-none transition-colors text-white placeholder-gray-400"
                      placeholder="Click auto-detect to get your location"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={detectCurrentLocation}
                    disabled={isDetectingLocation}
                    className="bg-white/5 backdrop-blur-sm border border-gray-600 px-4 py-3 rounded-lg text-teal-400 hover:bg-teal-400 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Navigation className={`h-5 w-5 ${isDetectingLocation ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">
                      {isDetectingLocation ? 'Finding...' : 'Auto-detect'}
                    </span>
                  </button>
                </div>
                {formData.latitude && formData.longitude && (
                  <p className="text-xs text-gray-400 mt-1">
                    Coordinates: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                  </p>
                )}
              </div>

              {/* Camera Section */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Take Photos *
                </label>
                
                {!showCamera ? (
                  <div className="bg-white/5 backdrop-blur-sm border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-teal-400 transition-colors">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">Capture photos of the issue on the spot</p>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="bg-white/5 backdrop-blur-sm border border-teal-400 px-6 py-3 rounded-lg text-teal-400 hover:bg-teal-400 hover:text-white transition-all shadow-lg hover:shadow-teal-400/25"
                    >
                      Open Camera
                    </button>
                  </div>
                ) : (
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-gray-600">
                    <div className="relative mb-4">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full rounded-lg bg-gray-900"
                        style={{ maxHeight: '400px', minHeight: '200px' }}
                        onCanPlay={() => {
                          console.log('Video can play');
                        }}
                        onError={(e) => {
                          console.error('Video error:', e);
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 rounded-lg pointer-events-none">
                        <div className="text-center">
                          <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-pulse" />
                          <p className="text-gray-400 text-sm">Camera loading...</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="absolute top-2 right-2 bg-red-500/80 backdrop-blur-sm p-2 rounded-full text-white hover:bg-red-600 transition-all z-10"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="flex justify-center space-x-4">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        disabled={!videoRef.current || videoRef.current.readyState < 2}
                        className="bg-white/5 backdrop-blur-sm border border-teal-400 px-6 py-3 rounded-lg text-teal-400 hover:bg-teal-400 hover:text-white transition-all shadow-lg hover:shadow-teal-400/25 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Camera className="h-5 w-5" />
                        <span>Capture Photo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          stopCamera();
                          setTimeout(startCamera, 500);
                        }}
                        className="bg-white/5 backdrop-blur-sm border border-gray-400 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-400 hover:text-white transition-all"
                      >
                        🔄 Retry
                      </button>
                    </div>
                  </div>
                )}

                {/* Captured Images */}
                {capturedImages.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-300 mb-2">
                      Captured Photos ({capturedImages.length}):
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {capturedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Captured ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-600"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <canvas ref={canvasRef} style={{ display: 'none' }} />
              </div>

              {/* Important Notice */}
              <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4 border-l-4 border-l-yellow-400">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-yellow-400 font-medium text-sm">Important Notice</h4>
                    <p className="text-gray-300 text-sm mt-1">
                      Please provide accurate information and at least one photo. False complaints may result in account suspension.
                      For emergency situations, contact local emergency services immediately.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full sm:w-auto bg-white/5 backdrop-blur-sm border border-teal-400 px-8 py-3 rounded-lg text-teal-400 hover:bg-teal-400 hover:text-white transition-all shadow-lg hover:shadow-teal-400/25 font-medium flex items-center justify-center space-x-2"
                >
                  <Send className="h-5 w-5" />
                  <span>Submit Complaint</span>
                </button>
                <p className="text-sm text-gray-400">
                  {capturedImages.length > 0 
                    ? `${capturedImages.length} photo${capturedImages.length > 1 ? 's' : ''} ready to submit`
                    : 'Please capture at least one photo'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintForm;