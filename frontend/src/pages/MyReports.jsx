import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  ThumbsUp, 
  Plus,
  AlertCircle,
  Trash,
  Droplet,
  Lightbulb,
  Clock,
  CheckCircle,
  User,
  Wrench,
  Eye
} from 'lucide-react';

const MyReports = () => {
  // Mock Data matching your screenshot exactly
  const [myReports, setMyReports] = useState([
    {
      id: 1,
      title: "Large Pothole on Main Street",
      description: "A large pothole has formed near the intersection of Main Street and Oak Avenue. It's about 2 feet wide and 6 inches deep. Several cars have been damaged.",
      category: "Pothole",
      status: "Submitted",
      priority: "High",
      location: "Main Street & Oak Avenue",
      date: "Feb 17",
      votes: 12
    },
    {
      id: 2,
      title: "Garbage Pile Behind Market",
      description: "A large pile of garbage has accumulated behind the Central Market area. It has been there for over a week and is causing a foul smell.",
      category: "Garbage",
      status: "Assigned",
      priority: "Medium",
      location: "Behind Central Market, Sector 15",
      date: "Feb 17",
      votes: 8
    },
    {
      id: 3,
      title: "Water Pipe Leaking Near School",
      description: "A water pipe has been leaking continuously near Government School, causing water wastage and waterlogging on the road.",
      category: "Water Leakage",
      status: "In Progress",
      priority: "Critical",
      location: "Near Government School, Block B",
      date: "Feb 17",
      votes: 23
    },
    {
      id: 4,
      title: "Streetlight Out on Elm Road",
      description: "Three consecutive streetlights are not working on Elm Road, making the area very dark and unsafe at night.",
      category: "Streetlight",
      status: "Under Review",
      priority: "Medium",
      location: "Elm Road, Sector 22",
      date: "Feb 17",
      votes: 5
    }
  ]);

  // Helper for Status Badge Colors & Icons
  const getStatusDisplay = (status) => {
    switch(status) {
      case 'Submitted': 
        return { style: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock };
      case 'Assigned': 
        return { style: 'bg-purple-100 text-purple-800 border-purple-200', icon: User };
      case 'In Progress': 
        return { style: 'bg-blue-100 text-blue-800 border-blue-200', icon: Wrench };
      case 'Under Review': 
        return { style: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: Eye };
      case 'Resolved': 
        return { style: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle };
      default: 
        return { style: 'bg-gray-100 text-gray-800', icon: Clock };
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

  // Helper for Category Icons
  const getCategoryIcon = (category) => {
     switch(category) {
        case 'Pothole': return <AlertCircle className="text-orange-500" size={20} />;
        case 'Garbage': return <Trash className="text-green-500" size={20} />;
        case 'Water Leakage': return <Droplet className="text-blue-500" size={20} />;
        case 'Streetlight': return <Lightbulb className="text-yellow-500" size={20} />;
        default: return <AlertCircle className="text-gray-500" size={20} />;
     }
  };

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
          const StatusIcon = getStatusDisplay(report.status).icon;
          
          return (
            <div key={report.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
                
                <div className="flex gap-4 flex-1">
                  {/* Category Icon Container */}
                  <div className="hidden sm:flex h-12 w-12 rounded-full bg-gray-50 items-center justify-center flex-shrink-0 border border-gray-100">
                    {getCategoryIcon(report.category)}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
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
                        <span>{report.location}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Calendar size={16} className="text-gray-400" />
                        <span>{report.date}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <ThumbsUp size={16} className="text-gray-400" />
                        <span>{report.votes}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end mt-4 md:mt-0 pl-0 md:pl-4 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 h-full">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 ${getStatusDisplay(report.status).style}`}>
                    <StatusIcon size={14} />
                    {report.status}
                  </span>
                  
                  {/* Mobile View Icon */}
                  <div className="md:hidden">
                     {getCategoryIcon(report.category)}
                  </div>
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