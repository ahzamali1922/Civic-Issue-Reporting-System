import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, MapPin, Loader2, Sparkles, AlertCircle, 
  UploadCloud, X, FileText, Send, Bot 
} from 'lucide-react';
import api from '../services/api';

const CATEGORY_MAP = {
  ROAD_DAMAGE: "ROAD_DAMAGE",
  ELECTRICAL: "ELECTRICAL",
  GARBAGE: "GARBAGE",
  FALLEN_TREE: "FALLEN_TREE",
  GRAFFITI: "GRAFFITI",
  DAMAGED_STRUCTURE: "DAMAGED_STRUCTURE",
  BROKEN_SIGN: "BROKEN_SIGN",
  OTHER: "OTHER"
};

const ReportIssue = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Multi-step state
  const [step, setStep] = useState(1);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('1'); 
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  
  // NEW: Advanced Location State
  const [location, setLocation] = useState({ lat: '', long: '' }); // Changed to empty strings for inputs
  const [locationMode, setLocationMode] = useState('auto'); // 'auto' or 'manual'
  const [addressDetails, setAddressDetails] = useState('');
  
  // AI Classification State
  const [aiConfidence, setAiConfidence] = useState(null);

  // NEW: Extracted geolocation logic so it can be refreshed manually
  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            long: position.coords.longitude
          });
          setError(''); // Clear any previous location errors
        },
        (err) => {
          setError("Location access is required. Please enable it or enter your coordinates manually.");
          setLocationMode('manual'); // Auto-switch to manual if GPS fails
          console.error(err);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLocationMode('manual');
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

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

  const handleAutoClassify = async () => {
    if (!image) {
      setError("Please upload an image for AI classification");
      return;
    }

    setAiLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('image', image);

      const res = await api.post('/api/predict/', formData);
      const { category, confidence } = res.data;

      setCategory(CATEGORY_MAP[category] || "OTHER");
      setAiConfidence(Math.round(confidence * 100));

    } catch (err) {
      console.error('AI Classification Error:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || "AI prediction failed";
      setError(`AI Error: ${errorMessage}`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate we have coordinates before submitting
    if (!location.lat || !location.long) {
      setError("Please provide a valid location (auto-detected or manual) to submit the report.");
      return;
    }

    setSubmitting(true);
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category || 'OTHER');
    formData.append('priority', priority);
    formData.append('latitude', location.lat);
    formData.append('longitude', location.long);
    formData.append('address_details', addressDetails); // NEW: Sending address details to Django
    
    if (image) {
      formData.append('image', image);
    }

    try {
      await api.post('/api/create-issue/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError("Failed to submit report. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const formatCategory = (cat) => {
    if (!cat) return 'Not selected';
    return cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
  };

  const formatSeverity = (sev) => {
    const map = { '0': 'Low', '1': 'Medium', '2': 'High', '3': 'Critical' };
    return map[sev] || 'Medium';
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Report a Civic Issue</h1>
          <p className="text-slate-500 mt-2">Help improve your community</p>
        </div>

        {/* Stepper (Unchanged) */}
        <div className="flex items-center justify-center mb-12 max-w-xl mx-auto">
          <div className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
              <Camera size={20} />
            </div>
            <span className={`text-xs font-medium ${step >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>Upload</span>
          </div>
          <div className={`flex-1 h-0.5 mx-4 ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
          <div className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
              <FileText size={20} />
            </div>
            <span className={`text-xs font-medium ${step >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>Describe</span>
          </div>
          <div className={`flex-1 h-0.5 mx-4 ${step >= 3 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
          <div className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
              <Send size={20} />
            </div>
            <span className={`text-xs font-medium ${step >= 3 ? 'text-slate-900' : 'text-slate-400'}`}>Submit</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 text-sm border border-red-100">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            {/* STEP 1: UPLOAD PHOTO (Unchanged) */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Upload Photo</h2>
                {!preview ? (
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 flex flex-col items-center justify-center transition-colors hover:border-indigo-400 hover:bg-slate-50 relative cursor-pointer group bg-slate-50/50">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="bg-white shadow-sm p-4 rounded-full mb-4 group-hover:scale-105 transition-transform">
                      <Camera className="text-indigo-600" size={28} />
                    </div>
                    <p className="text-base text-slate-900 font-medium">Click to upload a photo</p>
                    <p className="text-sm text-slate-500 mt-1">JPG, PNG up to 5MB</p>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 flex justify-center h-80">
                    <img src={preview} alt="Preview" className="h-full object-contain" />
                    <button type="button" onClick={removeImage} className="absolute top-4 right-4 bg-white p-2 rounded-full text-slate-600 hover:text-red-600 shadow-md transition-colors z-20"><X size={20} /></button>
                  </div>
                )}
                <div className="mt-8 flex justify-end">
                  <button type="button" onClick={nextStep} disabled={!image} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
                </div>
              </div>
            )}

            {/* STEP 2: DESCRIBE ISSUE (Unchanged) */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Describe the Issue</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="Brief title for the issue" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none" placeholder="Describe the issue in detail" />
                  </div>
                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-5 mt-2">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-indigo-900 font-medium">
                        <Sparkles size={18} className="text-indigo-600" /> AI Classification
                      </div>
                      <button type="button" onClick={handleAutoClassify} disabled={!description || aiLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                        {aiLoading ? 'Analyzing...' : 'Auto-Classify'}
                      </button>
                    </div>
                    {aiConfidence && !aiLoading && (
                      <div className="bg-white rounded-lg p-4 border border-indigo-50 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="bg-indigo-100 p-2 rounded-lg"><Bot className="text-indigo-600" size={20} /></div>
                          <div><p className="text-sm text-slate-500">AI Detected:</p><p className="font-semibold text-slate-900">{formatCategory(category)}</p></div>
                        </div>
                        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">{aiConfidence}%</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-8 flex justify-between items-center">
                  <button type="button" onClick={prevStep} className="px-6 py-2.5 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors">Back</button>
                  <button type="button" onClick={nextStep} disabled={!title || !description} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
                </div>
              </div>
            )}

            {/* STEP 3: FINAL DETAILS */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Final Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white">
                      <option value="">Select category</option>
                      <option value="ROAD_DAMAGE">Road Damage</option>
                      <option value="ELECTRICAL">Electrical Issue</option>
                      <option value="GARBAGE">Garbage</option>
                      <option value="FALLEN_TREE">Fallen Tree</option>
                      <option value="GRAFFITI">Graffiti</option>
                      <option value="DAMAGED_STRUCTURE">Damaged Structure</option>
                      <option value="BROKEN_SIGN">Broken Sign</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Severity</label>
                    <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white">
                      <option value="0">Low</option>
                      <option value="1">Medium</option>
                      <option value="2">High</option>
                      <option value="3">Critical</option>
                    </select>
                  </div>
                </div>

                {/* NEW: Updated Location Block */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Location Detection</label>
                  
                  {/* Toggle Buttons */}
                  <div className="flex gap-4 mb-4">
                    <button
                      type="button"
                      onClick={() => setLocationMode('auto')}
                      className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 transition-colors ${locationMode === 'auto' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      <MapPin size={16} /> Auto-Detect
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocationMode('manual')}
                      className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${locationMode === 'manual' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      Manual Entry
                    </button>
                  </div>

                  {/* Coordinates Input / Display */}
                  {locationMode === 'auto' ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
                      <MapPin className="text-indigo-600 mt-0.5" size={20} />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium text-slate-900">GPS Coordinates</p>
                          <button type="button" onClick={fetchLocation} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                            Refresh GPS
                          </button>
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {location.lat ? `${Number(location.lat).toFixed(4)}, ${Number(location.long).toFixed(4)}` : 'Fetching location...'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Latitude</label>
                        <input
                          type="number"
                          step="any"
                          value={location.lat}
                          onChange={(e) => setLocation({ ...location, lat: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm bg-white"
                          placeholder="e.g. 28.4744"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Longitude</label>
                        <input
                          type="number"
                          step="any"
                          value={location.long}
                          onChange={(e) => setLocation({ ...location, long: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm bg-white"
                          placeholder="e.g. 77.5040"
                        />
                      </div>
                    </div>
                  )}

                  {/* Detailed Address Field */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Detailed Address / Landmark</label>
                    <textarea
                      value={addressDetails}
                      onChange={(e) => setAddressDetails(e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none text-sm"
                      placeholder="e.g. Near Knowledge Park II Metro Station, opposite the central park"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button type="button" onClick={prevStep} className="px-6 py-2.5 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors">Back</button>
                  <button type="submit" disabled={submitting || !location.lat || !location.long} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-70 flex items-center gap-2">
                    {submitting ? <><Loader2 className="animate-spin" size={18} /> Submitting...</> : 'Submit Report'}
                  </button>
                </div>
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;