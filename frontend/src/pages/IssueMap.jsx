import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';

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
  // Mock Data with Coordinates (Centered around Delhi/NCR as per screenshot)
  const [issues, setIssues] = useState([
    {
      id: 1,
      title: "Large Pothole on Main Street",
      category: "Pothole",
      status: "Submitted",
      severity: "High",
      lat: 28.6139, 
      lng: 77.2090
    },
    {
      id: 2,
      title: "Garbage Pile Behind Market",
      category: "Garbage",
      status: "Assigned",
      severity: "Medium",
      lat: 28.6250, 
      lng: 77.2150
    },
    {
      id: 3,
      title: "Water Pipe Leaking Near School",
      category: "Water Leakage",
      status: "In Progress",
      severity: "Critical",
      lat: 28.6050, 
      lng: 77.2250
    },
    {
      id: 4,
      title: "Streetlight Out on Elm Road",
      category: "Streetlight",
      status: "Under Review",
      severity: "Medium",
      lat: 28.6300, 
      lng: 77.1950
    },
    {
      id: 5,
      title: "Blocked Drainage Causing Flood",
      category: "Drainage",
      status: "Resolved",
      severity: "High",
      lat: 28.5950, 
      lng: 77.2000
    }
  ]);

  // Center the map on New Delhi
  const mapCenter = [28.6139, 77.2090];
  const zoomLevel = 12;

  // Helper for Status Colors in the Popup
  const getStatusColor = (status) => {
    switch(status) {
      case 'Submitted': return 'text-yellow-600';
      case 'Assigned': return 'text-purple-600';
      case 'In Progress': return 'text-blue-600';
      case 'Resolved': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Issue Map</h1>
        <p className="text-gray-500 mt-1">{issues.length} geolocated issues</p>
      </div>

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
            
            {/* Render Markers */}
            {issues.map((issue) => (
              <Marker 
                key={issue.id} 
                position={[issue.lat, issue.lng]} 
                icon={defaultIcon}
              >
                <Popup className="rounded-xl">
                  <div className="p-1 min-w-[200px]">
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{issue.title}</h3>
                    
                    <div className="flex items-center justify-between mt-2 mb-3 text-xs">
                      <span className="bg-gray-100 px-2 py-1 rounded text-gray-700 font-medium">
                        {issue.category}
                      </span>
                      <span className={`font-semibold ${issue.severity === 'Critical' ? 'text-red-600' : issue.severity === 'High' ? 'text-orange-600' : 'text-yellow-600'}`}>
                        {issue.severity}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100 text-xs font-medium">
                      {issue.status === 'Resolved' ? (
                        <CheckCircle size={14} className="text-green-600" />
                      ) : (
                        <Clock size={14} className={getStatusColor(issue.status)} />
                      )}
                      <span className={getStatusColor(issue.status)}>
                        Status: {issue.status}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

    </div>
  );
};

export default IssueMap;