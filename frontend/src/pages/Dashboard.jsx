import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, ArrowRight, Activity, Clock, CheckCircle, 
  AlertTriangle, MapPin, Calendar, ThumbsUp, AlertCircle,
  Loader2, Trash, Droplet, Lightbulb, Waves, Wrench
} from 'lucide-react';
import api from '../services/api';

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
  // Helper to get status colors (Mapped to Django Choices)
  const getStatusDisplay = (status) => {
    switch(status) {
      case 'PENDING': 
        return { style: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Pending' };
      case 'IN_PROGRESS': 
        return { style: 'bg-blue-100 text-blue-800 border-blue-200', label: 'In Progress' };
      case 'RESOLVED': 
        return { style: 'bg-green-100 text-green-800 border-green-200', label: 'Resolved' };
      default: 
        return { style: 'bg-gray-100 text-gray-800', label: status };
    }
  };

  // Helper to get priority colors
  const getPriorityColor = (priority) => {
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
       case 'POTHOLE': return <AlertCircle className="text-orange-500" size={20} />;
       case 'GARBAGE': return <Trash className="text-green-500" size={20} />;
       case 'WATER': return <Droplet className="text-blue-500" size={20} />;
       case 'STREETLIGHT': return <Lightbulb className="text-yellow-500" size={20} />;
       case 'DRAINAGE': return <Waves className="text-cyan-500" size={20} />;
       default: return <AlertCircle className="text-gray-500" size={20} />;
    }
  };

  const statusConfig = getStatusDisplay(issue.status);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow mb-4">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <div className="mt-1">
             <div className="p-2 bg-gray-50 border border-gray-100 rounded-lg">
               {getCategoryIcon(issue.category)}
             </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 capitalize">{issue.title}</h3>
            <p className="text-gray-600 mt-1 text-sm line-clamp-2">{issue.description}</p>
            
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
              <span className={`px-2 py-1 rounded border text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                {issue.priority}
              </span>
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>Lat: {issue.location.split(',')[0]}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{issue.date}</span>
              </div>
              <div className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer transition-colors">
                <ThumbsUp size={14} />
                <span>{issue.votes}</span>
              </div>
            </div>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.style}`}>
          {statusConfig.label}
        </span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, active: 0, resolved: 0, critical: 0 });
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/api/all-issues/');
        const data = response.data;

        // 1. Calculate Stats
        const total = data.length;
        // Active means it's neither resolved nor rejected
        const active = data.filter(issue => issue.status === 'PENDING' || issue.status === 'IN_PROGRESS').length;
        const resolved = data.filter(issue => issue.status === 'RESOLVED').length;
        // priority 3 is Critical in your mapping
        const critical = data.filter(issue => issue.priority === 3).length; 

        setStats({ total, active, resolved, critical });

        // 2. Format Recent Issues (Take the top 3)
        const priorityMap = { 0: 'Low', 1: 'Medium', 2: 'High', 3: 'Critical' };
        
        const formattedRecent = data.slice(0, 3).map(issue => ({
          id: issue.id,
          title: issue.title,
          description: issue.description,
          category: issue.category,
          status: issue.status,
          priority: priorityMap[issue.priority] || 'Medium',
          location: `${issue.latitude.toFixed(4)}, ${issue.longitude.toFixed(4)}`,
          date: new Date(issue.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          votes: 0 // Placeholder
        }));

        setRecentIssues(formattedRecent);

      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Unable to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-indigo-600">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 border border-red-100">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

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
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors flex items-center gap-2 shadow-sm"
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
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
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
          <Link to="/issues" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1 transition-colors">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="space-y-4">
          {recentIssues.length > 0 ? (
            recentIssues.map(issue => (
              <IssueCard key={issue.id} issue={issue} />
            ))
          ) : (
             <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
               <p className="text-gray-500">No recent reports found in the system.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;