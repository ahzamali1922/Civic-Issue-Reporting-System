import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Loader2, Sparkles, AlertCircle, UploadCloud, X } from 'lucide-react';
import api from '../services/api';

const ReportIssue = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('1'); // Default to Medium (1)
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [location, setLocation] = useState({ lat: null, long: null });

  // 1. Get User Location on Mount (Crucial for backend)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            long: position.coords.longitude
          });
        },
        (err) => {
          setError("Location access is required to report issues. Please enable it in your browser.");
          console.error(err);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  // 2. Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  // 3. Mock AI Classification Logic
  const handleAutoClassify = () => {
    if (!description) return;
    
    setAiLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const desc = description.toLowerCase();
      let detectedCategory = 'OTHER';
      let detectedPriority = '1'; // Medium
      
      // Simple keyword matching
      if (desc.includes('pothole') || desc.includes('road') || desc.includes('asphalt')) {
        detectedCategory = 'POTHOLE';
        detectedPriority = '2'; // High
      }
      else if (desc.includes('garbage') || desc.includes('trash') || desc.includes('waste') || desc.includes('smell')) {
        detectedCategory = 'GARBAGE';
        detectedPriority = '1'; // Medium
      }
      else if (desc.includes('water') || desc.includes('leak') || desc.includes('pipe') || desc.includes('flood')) {
        detectedCategory = 'WATER';
        detectedPriority = '3'; // Critical
      }
      else if (desc.includes('light') || desc.includes('dark') || desc.includes('lamp') || desc.includes('bulb')) {
        detectedCategory = 'STREETLIGHT';
        detectedPriority = '1';
      }
      else if (desc.includes('drain') || desc.includes('sewer') || desc.includes('clog')) {
        detectedCategory = 'DRAINAGE';
        detectedPriority = '2';
      }

      setCategory(detectedCategory);
      setPriority(detectedPriority);
      setAiLoading(false);
    }, 1500); 
  };

  // 4. Submit to Django API
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!location.lat || !location.long) {
      setError("We couldn't get your location. Please allow location access and refresh.");
      return;
    }

    setSubmitting(true);
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category || 'OTHER'); // Fallback
    formData.append('priority', priority);
    formData.append('latitude', location.lat);
    formData.append('longitude', location.long);
    if (image) {
      formData.append('image', image);
    }

    try {
      // Endpoint from your Django urls.py
      await api.post('/api/create-issue/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Redirect to dashboard on success
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError("Failed to submit report. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Report a Civic Issue</h1>
        <p className="text-gray-500 mt-1">Help improve your community by reporting problems</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 text-sm border border-red-100">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Photo Evidence Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Photo Evidence</label>
            
            {!preview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center transition-colors hover:border-indigo-400 hover:bg-gray-50 relative cursor-pointer group">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="bg-indigo-50 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                  <Camera className="text-indigo-600" size={24} />
                </div>
                <p className="text-sm text-gray-900 font-medium">Click to upload a photo</p>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-gray-200">
                <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
                <button 
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-gray-600 hover:text-red-600 shadow-sm transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
              placeholder="Brief title for the issue"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none placeholder:text-gray-400"
              placeholder="Describe the issue in detail — what, where, and how severe is it?"
              required
            />
          </div>

          {/* Auto Classify Button */}
          <button
            type="button"
            onClick={handleAutoClassify}
            disabled={!description || aiLoading}
            className="w-full py-3 px-4 bg-indigo-50 text-indigo-700 font-medium rounded-lg border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {aiLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Analyzing issue content...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Auto-Classify with AI
              </>
            )}
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white"
                required
              >
                <option value="">Select category</option>
                <option value="POTHOLE">Pothole</option>
                <option value="GARBAGE">Garbage</option>
                <option value="WATER">Water Leakage</option>
                <option value="STREETLIGHT">Street Light</option>
                <option value="DRAINAGE">Drainage</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Severity Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white"
              >
                <option value="0">Low</option>
                <option value="1">Medium</option>
                <option value="2">High</option>
                <option value="3">Critical</option>
              </select>
            </div>
          </div>

          {/* Location Status Indicator */}
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
            <MapPin size={16} className={location.lat ? "text-green-500" : "text-gray-400"} />
            {location.lat ? (
              <span>Location captured: {location.lat.toFixed(4)}, {location.long.toFixed(4)}</span>
            ) : (
              <span>Detecting location... (Required)</span>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting || !location.lat}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium shadow-sm hover:shadow transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Submitting Report...
                </>
              ) : (
                <>
                  <UploadCloud size={20} />
                  Submit Report
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ReportIssue;