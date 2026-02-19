import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  ArrowRight, 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  ThumbsUp,
  AlertCircle 
} from 'lucide-react';

// Reusable Stat Card Component
const StatCard = ({ title, count, icon: Icon, colorClass, bgClass }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
      <h3 className="text-3xl font-bold text-gray-900 mt-2">{count}</h3>
    </div>
    <div className={`p-4 rounded-full ${bgClass}`}>
      <Icon className={colorClass} size={24} />
    </div>
  </div>
);

// Reusable Recent Issue Card Component
const IssueCard = ({ issue }) => {
  // Helper to get status colors
  const getStatusColor = (status) => {
    switch(status) {
      case 'Submitted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper to get priority colors
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow mb-4">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <div className="mt-1">
             {/* Icon based on category - simplified for now */}
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertCircle className="text-orange-600" size={20} />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{issue.title}</h3>
            <p className="text-gray-600 mt-1 text-sm line-clamp-2">{issue.description}</p>
            
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
              <span className={`px-2 py-1 rounded border text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                {issue.priority}
              </span>
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{issue.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{issue.date}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <ThumbsUp size={14} />
                <span>{issue.votes}</span>
              </div>
            </div>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(issue.status)}`}>
          {issue.status}
        </span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  // Mock Data (Replace with API call later)
  const stats = {
    total: 5,
    active: 4,
    resolved: 1,
    critical: 1
  };

  const recentIssues = [
    {
      id: 1,
      title: "Large Pothole on Main Street",
      description: "A large pothole has formed near the intersection of Main Street and Oak Avenue. It's about 2 feet wide and 6 inches deep.",
      status: "Submitted",
      priority: "High",
      location: "Main Street & Oak Avenue",
      date: "Feb 17",
      votes: 12
    },
    {
      id: 2,
      title: "Garbage Pile Behind Market",
      description: "A large pile of garbage has accumulated behind the Central Market area. It is causing a foul smell.",
      status: "In Progress",
      priority: "Medium",
      location: "Sector 15 Market",
      date: "Feb 16",
      votes: 8
    }
  ];

  return (
    <div className="space-y-8">
      {/* 1. Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 md:p-12 shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Civic Issue Tracker</h1>
          <p className="text-indigo-100 text-lg mb-8">
            Report, track, and resolve civic issues in your community. Together we build better cities.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/report-issue" 
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Report Issue
            </Link>
            <Link 
              to="/issues" 
              className="bg-indigo-500/30 backdrop-blur-sm border border-indigo-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-500/40 transition-colors flex items-center gap-2"
            >
              View All Issues
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
        
        {/* Decorative Circle Background */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Reports" 
          count={stats.total} 
          icon={Activity} 
          colorClass="text-indigo-600" 
          bgClass="bg-indigo-50" 
        />
        <StatCard 
          title="Active Issues" 
          count={stats.active} 
          icon={Clock} 
          colorClass="text-amber-600" 
          bgClass="bg-amber-50" 
        />
        <StatCard 
          title="Resolved" 
          count={stats.resolved} 
          icon={CheckCircle} 
          colorClass="text-green-600" 
          bgClass="bg-green-50" 
        />
        <StatCard 
          title="Critical" 
          count={stats.critical} 
          icon={AlertTriangle} 
          colorClass="text-red-600" 
          bgClass="bg-red-50" 
        />
      </div>

      {/* 3. Recent Reports Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Reports</h2>
          <Link to="/issues" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="space-y-4">
          {recentIssues.map(issue => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;