import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, Calendar, ThumbsUp, Plus, AlertCircle, 
  Trash, Droplet, Lightbulb, Clock, CheckCircle, 
  User, Wrench, Eye, Loader2 
} from 'lucide-react';
import api from '../services/api'; // Import our API service

const MyReports = () => {
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Fetch data from Django when the page loads
  useEffect(() => {
    const fetchMyIssues = async () => {
      try {
        // Calls the api_my_issues view from your Django backend
        const response = await api.get('/api/my_issues/'); 
        
        // Map Django's integer priority to our UI strings
        const priorityMap = { 0: 'Low', 1: 'Medium', 2: 'High', 3: 'Critical' };

        // Format the Django data to match what our UI components expect
        const formattedIssues = response.data.map(issue => ({
          id: issue.id,
          title: issue.title,
          description: issue.description,
          category: issue.category, // e.g., "POTHOLE"
          status: issue.status,     // e.g., "PENDING" or "IN_PROGRESS"
          priority: priorityMap[issue.priority] || 'Medium',
          location: `${issue.latitude.toFixed(4)}, ${issue.longitude.toFixed(4)}`,
          // Format Django's datetime string into "Feb 17"
          date: new Date(issue.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
          votes: 0 // Placeholder: Add votes to models.py later if you want this feature!
        }));

        setMyReports(formattedIssues);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
        setError("Could not load your reports. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyIssues();
  }, []);

  // Helper for Status Badge Colors & Icons (Updated to match Django's exact choices)
  const getStatusDisplay = (status) => {
    switch(status) {
      case 'PENDING': 
        return { style: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock, label: 'Pending' };
      case 'IN_PROGRESS': 
        return { style: 'bg-blue-100 text-blue-800 border-blue-200', icon: Wrench, label: 'In Progress' };
      case 'RESOLVED': 
        return { style: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle, label: 'Resolved' };
      default: 
        return { style: 'bg-gray-100 text-gray-800', icon: Clock, label: status };
    }
  };

  // Helper for Priority Colors
  const getPriorityStyle = (priority) => {
    switch(priority) {
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Helper for Category Icons (Updated to match Django's exact choices)
  const getCategoryIcon = (category) => {
     switch(category) {
        case 'POTHOLE': return <AlertCircle className="text-orange-500" size={20} />;
        case 'GARBAGE': return <Trash className="text-green-500" size={20} />;
        case 'WATER': return <Droplet className="text-blue-500" size={20} />;
        case 'STREETLIGHT': return <Lightbulb className="text-yellow-500" size={20} />;
        default: return <AlertCircle className="text-gray-500" size={20} />;
     }
  };

  // 2. Render Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-indigo-600">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="font-medium">Loading your reports...</p>
      </div>
    );
  }

  // 3. Render Error State
  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-3">
        <AlertCircle size={20} />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Reports</h1>
          <p className="text-gray-500 mt-1">Track issues you've reported</p>
        </div>
        
        <Link 
          to="/report-issue" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          New Report
        </Link>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {myReports.map((report) => {
          const statusConfig = getStatusDisplay(report.status);
          const StatusIcon = statusConfig.icon;
          
          return (
            <div key={report.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
                
                <div className="flex gap-4 flex-1">
                  {/* Category Icon */}
                  <div className="hidden sm:flex h-12 w-12 rounded-full bg-gray-50 items-center justify-center flex-shrink-0 border border-gray-100">
                    {getCategoryIcon(report.category)}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors capitalize">
                        {report.title}
                      </h3>
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                      {report.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500">
                      <span className={`px-2.5 py-1 rounded-md border font-medium ${getPriorityStyle(report.priority)}`}>
                        {report.priority}
                      </span>
                      
                      <div className="flex items-center gap-1.5">
                        <MapPin size={16} className="text-gray-400" />
                        <span>Lat: {report.location.split(',')[0]}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Calendar size={16} className="text-gray-400" />
                        <span>{report.date}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end mt-4 md:mt-0 pl-0 md:pl-4 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 h-full">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 ${statusConfig.style}`}>
                    <StatusIcon size={14} />
                    {statusConfig.label}
                  </span>
                </div>

              </div>
            </div>
          );
        })}

        {myReports.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
            <h3 className="text-lg font-medium text-gray-900">No reports found</h3>
            <p className="text-gray-500 mt-1">You haven't reported any civic issues yet.</p>
            <Link 
              to="/report-issue" 
              className="mt-4 inline-flex text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Report your first issue →
            </Link>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default MyReports;