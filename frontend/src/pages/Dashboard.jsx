import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, ArrowRight, Activity, Clock, CheckCircle, 
  AlertTriangle, MapPin, Calendar, ThumbsUp, AlertCircle,
  Loader2, Trash, Droplet, Lightbulb, Waves, Wrench
} from 'lucide-react';
import api from '../services/api';

// Reusable Stat Card Component - Upgraded with Glassmorphism
const StatCard = ({ title, count, icon: Icon, colorClass, bgClass, delay }) => (
  <div className={`bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-xl shadow-gray-200/50 hover:-translate-y-1 transition-transform duration-300 animate-fade-in-up ${delay}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-4xl font-extrabold text-gray-900">{count}</h3>
      </div>
      <div className={`p-4 rounded-2xl ${bgClass}`}>
        <Icon className={colorClass} size={28} />
      </div>
    </div>
  </div>
);

// Reusable Recent Issue Card Component - Upgraded
const IssueCard = ({ issue }) => {
  const getStatusDisplay = (status) => {
    switch(status) {
      case 'PENDING': 
        return { style: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Pending', icon: Clock };
      case 'IN_PROGRESS': 
        return { style: 'bg-blue-50 text-blue-700 border-blue-200', label: 'In Progress', icon: Activity };
      case 'RESOLVED': 
        return { style: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Resolved', icon: CheckCircle };
      default: 
        return { style: 'bg-gray-50 text-gray-700 border-gray-200', label: status, icon: AlertCircle };
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'GARBAGE': return <Trash className="text-emerald-500" size={20} />;
      case 'WATER': return <Droplet className="text-blue-500" size={20} />;
      case 'ELECTRICITY': return <Lightbulb className="text-amber-500" size={20} />;
      case 'POTHOLE': return <Waves className="text-stone-500" size={20} />;
      default: return <Wrench className="text-gray-500" size={20} />;
    }
  };

  const statusConfig = getStatusDisplay(issue.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gray-50/50 hover:bg-blue-50/50 rounded-2xl transition-colors border border-transparent hover:border-blue-100">
      <div className="flex items-start gap-4 mb-3 sm:mb-0">
        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
          {getCategoryIcon(issue.category)}
        </div>
        <div>
          <h4 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors text-lg">{issue.title}</h4>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-sm text-gray-500 flex items-center gap-1 font-medium">
              <MapPin size={14} className="text-gray-400" />
              {issue.location}
            </span>
            <span className="text-sm text-gray-500 flex items-center gap-1 font-medium">
              <Calendar size={14} className="text-gray-400" />
              {new Date(issue.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${statusConfig.style}`}>
          <StatusIcon size={14} />
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
        const [statsRes, issuesRes] = await Promise.all([
          api.get('/api/dashboard-stats/'),
          api.get('/api/recent-issues/')
        ]);
        
        setStats(statsRes.data);
        setRecentIssues(issuesRes.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative z-0 overflow-hidden py-12 px-6 lg:px-8">
      
      {/* --- Ambient Background Effects --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-100/60 to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in-up">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
            <p className="text-gray-500 font-medium mt-2 text-lg">Track your reports and make a difference.</p>
          </div>
          <Link 
            to="/report-issue" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3.5 rounded-full font-bold hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all"
          >
            <Plus size={20} />
            Report New Issue
          </Link>
        </div>

        {error && (
          <div className="bg-red-50/80 backdrop-blur-md border-l-4 border-red-500 p-4 rounded-r-xl animate-fade-in-up">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Reports" count={stats.total} icon={Activity} colorClass="text-blue-600" bgClass="bg-blue-50" delay="[animation-delay:100ms]" />
          <StatCard title="Active Issues" count={stats.active} icon={Clock} colorClass="text-amber-500" bgClass="bg-amber-50" delay="[animation-delay:200ms]" />
          <StatCard title="Resolved" count={stats.resolved} icon={CheckCircle} colorClass="text-emerald-500" bgClass="bg-emerald-50" delay="[animation-delay:300ms]" />
          <StatCard title="Critical" count={stats.critical} icon={AlertTriangle} colorClass="text-red-500" bgClass="bg-red-50" delay="[animation-delay:400ms]" />
        </div>

        {/* Recent Reports Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-xl shadow-gray-200/50 overflow-hidden animate-fade-in-up [animation-delay:500ms]">
          <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white/50">
            <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
              <Activity className="text-blue-500" size={24} />
              Recent Reports
            </h2>
            <Link to="/issues" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 group">
              View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="p-6">
            {recentIssues.length > 0 ? (
              <div className="space-y-3">
                {recentIssues.map(issue => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-4">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <ThumbsUp className="text-gray-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No recent reports</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">Your neighborhood is looking good! If you spot an issue, click the button above to report it.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;