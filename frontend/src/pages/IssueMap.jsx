import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Clock, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api';

// FIX: Leaflet default icon path issue in React
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const IssueMap = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch real coordinates on mount
  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const response = await api.get('/api/all-issues/');
        
        // Map Django's integer priority
        const priorityMap = { 0: 'Low', 1: 'Medium', 2: 'High', 3: 'Critical' };

        // Filter out any issues that might have missing coordinates, then format them
        const mapIssues = response.data
          .filter(issue => issue.latitude && issue.longitude) 
          .map(issue => ({
            id: issue.id,
            title: issue.title,
            category: issue.category,
            status: issue.status,
            severity: priorityMap[issue.priority] || 'Medium',
            // Ensure they are parsed as numbers for Leaflet
            lat: parseFloat(issue.latitude),
            lng: parseFloat(issue.longitude) 
          }));

        setIssues(mapIssues);
      } catch (err) {
        console.error("Map fetch error:", err);
        setError("Unable to load map data. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, []);

  // Center the map on the first real issue, or default to Greater Noida/Delhi region
  const defaultCenter = [28.4744, 77.5040]; 
  const mapCenter = issues.length > 0 ? [issues[0].lat, issues[0].lng] : defaultCenter;
  const zoomLevel = 12;

  // Helper for Status Colors in the Popup (Mapped to Django Choices)
  const getStatusDisplay = (status) => {
    switch(status) {
      case 'PENDING': return { color: 'text-yellow-600', label: 'Pending' };
      case 'IN_PROGRESS': return { color: 'text-blue-600', label: 'In Progress' };
      case 'RESOLVED': return { color: 'text-green-600', label: 'Resolved' };
      default: return { color: 'text-gray-600', label: status };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-indigo-600">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="font-medium">Loading geospatial data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Issue Map</h1>
        <p className="text-gray-500 mt-1">{issues.length} geolocated issues found in database</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 border border-red-100">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Map Container */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200">
        <div className="h-[600px] w-full rounded-xl overflow-hidden relative z-0">
          <MapContainer 
            center={mapCenter} 
            zoom={zoomLevel} 
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            {/* OpenStreetMap Tiles */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Render Real Markers */}
            {issues.map((issue) => {
              const statusConfig = getStatusDisplay(issue.status);

              return (
                <Marker 
                  key={issue.id} 
                  position={[issue.lat, issue.lng]} 
                  icon={defaultIcon}
                >
                  <Popup className="rounded-xl">
                    <div className="p-1 min-w-[200px]">
                      <h3 className="font-bold text-gray-900 text-sm mb-1 capitalize">{issue.title}</h3>
                      
                      <div className="flex items-center justify-between mt-2 mb-3 text-xs">
                        <span className="bg-gray-100 px-2 py-1 rounded text-gray-700 font-medium capitalize">
                          {issue.category}
                        </span>
                        <span className={`font-semibold ${issue.severity === 'Critical' ? 'text-red-600' : issue.severity === 'High' ? 'text-orange-600' : 'text-yellow-600'}`}>
                          {issue.severity}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100 text-xs font-medium">
                        {issue.status === 'RESOLVED' ? (
                          <CheckCircle size={14} className="text-green-600" />
                        ) : (
                          <Clock size={14} className={statusConfig.color} />
                        )}
                        <span className={statusConfig.color}>
                          Status: {statusConfig.label}
                        </span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>

    </div>
  );
};

export default IssueMap;