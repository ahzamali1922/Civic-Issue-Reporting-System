import React, { useState, useEffect } from 'react';
import { 
  Activity, Clock, AlertTriangle, CheckCircle, Edit2, 
  Trash2, Filter, AlertCircle, Trash, Droplet, Lightbulb, 
  Waves, User, Wrench, Eye, Loader2
} from 'lucide-react';
import api from '../services/api';

const AdminPanel = () => {
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch data on mount
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await api.get('/api/all-issues/');
        const data = response.data;

        // Calculate Stats based on Django Status Choices
        setStats({
          total: data.length,
          pending: data.filter(i => i.status === 'PENDING').length,
          inProgress: data.filter(i => i.status === 'IN_PROGRESS').length,
          resolved: data.filter(i => i.status === 'RESOLVED').length,
        });

        // Map Django's integer priority
        const priorityMap = { 0: 'Low', 1: 'Medium', 2: 'High', 3: 'Critical' };

        const formattedIssues = data.map(issue => ({
          id: issue.id,
          title: issue.title,
          location: `${issue.latitude.toFixed(4)}, ${issue.longitude.toFixed(4)}`, // Fallback since we don't have address text yet
          category: issue.category,
          severity: priorityMap[issue.priority] || 'Medium',
          status: issue.status,
          department: "Unassigned", // Placeholder: You can add departments to models.py later
          date: new Date(issue.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }));

        setIssues(formattedIssues);
      } catch (err) {
        console.error("Admin fetch error:", err);
        setError("Unable to load admin data. Please ensure you are logged in as an Authority.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  // Helper for Status Badge Colors (Mapped to Django)
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

  const getSeverityStyle = (severity) => {
    switch(severity) {
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryDisplay = (category) => {
     switch(category) {
        case 'POTHOLE': return { color: 'text-orange-500', icon: AlertCircle, label: 'Pothole' };
        case 'GARBAGE': return { color: 'text-green-500', icon: Trash, label: 'Garbage' };
        case 'WATER': return { color: 'text-blue-500', icon: Droplet, label: 'Water Leakage' };
        case 'STREETLIGHT': return { color: 'text-yellow-500', icon: Lightbulb, label: 'Streetlight' };
        case 'DRAINAGE': return { color: 'text-cyan-500', icon: Waves, label: 'Drainage' };
        default: return { color: 'text-gray-500', icon: AlertCircle, label: category };
     }
  };

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this issue?")) {
        // UI ONLY update for now. We will hook this up to Django later!
        setIssues(issues.filter(issue => issue.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-indigo-600">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="font-medium">Loading Authority Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-500 mt-1">Manage and assign reported issues</p>
        </div>
        <div className="flex gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                <Filter size={18} />
                <span>Filter</span>
             </button>
             <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                <Activity size={18} />
                <span>Generate Report</span>
             </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 border border-red-100">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</h3>
          </div>
          <div className="p-3 bg-indigo-50 rounded-lg">
            <Activity className="text-indigo-600" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pending</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.pending}</h3>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            <Clock className="text-orange-600" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">In Progress</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.inProgress}</h3>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <Wrench className="text-blue-600" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Resolved</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.resolved}</h3>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <CheckCircle className="text-green-600" size={24} />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Issue</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Category</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Severity</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {issues.map((issue) => {
                const statusConfig = getStatusDisplay(issue.status);
                const StatusIcon = statusConfig.icon;
                const categoryConfig = getCategoryDisplay(issue.category);
                const CategoryIcon = categoryConfig.icon;

                return (
                  <tr key={issue.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900 capitalize">{issue.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Lat: {issue.location.split(',')[0]}</p>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CategoryIcon className={categoryConfig.color} size={18} />
                        <span className="text-sm font-medium text-gray-700">{categoryConfig.label}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded border text-xs font-medium ${getSeverityStyle(issue.severity)}`}>
                        {issue.severity}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.style}`}>
                        <StatusIcon size={14} />
                        {statusConfig.label}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {issue.date}
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button className="text-gray-400 hover:text-indigo-600 transition-colors" title="Edit Issue">
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(issue.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors" 
                          title="Delete Issue"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {issues.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-500">
              No issues found in the database.
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default AdminPanel;