import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, MapPin, Calendar, ThumbsUp, AlertCircle, 
  CheckCircle, Clock, MoreVertical, Trash, Droplet, Lightbulb, Waves, Wrench, Loader2
} from 'lucide-react';
import api from '../services/api';

const AllIssues = () => {
  // State for data and loading/error handling
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for filters (Matching Django choices)
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  
  // Fetch data on mount
  useEffect(() => {
    const fetchAllIssues = async () => {
      try {
        const response = await api.get('/api/all-issues/');
        
        // Map Django's integer priority to UI strings
        const priorityMap = { 0: 'Low', 1: 'Medium', 2: 'High', 3: 'Critical' };

        const formattedIssues = response.data.map(issue => ({
          id: issue.id,
          title: issue.title,
          description: issue.description,
          category: issue.category, // e.g., 'POTHOLE'
          status: issue.status,     // e.g., 'PENDING'
          priority: priorityMap[issue.priority] || 'Medium',
          location: `${issue.latitude.toFixed(4)}, ${issue.longitude.toFixed(4)}`,
          date: new Date(issue.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          votes: 0 // Placeholder
        }));

        setIssues(formattedIssues);
      } catch (err) {
        console.error("Failed to fetch issues:", err);
        setError("Could not load issues. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllIssues();
  }, []);

  // Filter Logic
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || issue.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || issue.category === categoryFilter;
    const matchesSeverity = severityFilter === 'All' || issue.priority === severityFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesSeverity;
  });

  // Helper for Status Badge Colors (Mapped to Django Choices)
  const getStatusDisplay = (status) => {
    switch(status) {
      case 'PENDING': 
        return { style: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock, label: 'Pending' };
      case 'IN_PROGRESS': 
        return { style: 'bg-blue-100 text-blue-800 border-blue-200', icon: Wrench, label: 'In Progress' };
      case 'RESOLVED': 
        return { style: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle, label: 'Resolved' };
      default: 
        return { style: 'bg-gray-100 text-gray-800 border-gray-200', icon: Clock, label: status };
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Helper for Category Icons (Mapped to Django Choices)
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

  // Render Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-indigo-600">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="font-medium">Loading community issues...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">All Issues</h1>
        <p className="text-gray-500 mt-1">{filteredIssues.length} issues found</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 border border-red-100">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search issues..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:border-indigo-500 outline-none cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:border-indigo-500 outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="POTHOLE">Pothole</option>
            <option value="GARBAGE">Garbage</option>
            <option value="WATER">Water Leakage</option>
            <option value="STREETLIGHT">Streetlight</option>
            <option value="DRAINAGE">Drainage</option>
            <option value="OTHER">Other</option>
          </select>

          <select 
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:border-indigo-500 outline-none cursor-pointer"
          >
            <option value="All">All Severity</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {filteredIssues.map((issue) => {
          const statusConfig = getStatusDisplay(issue.status);
          const StatusIcon = statusConfig.icon;

          return (
            <div key={issue.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
                
                <div className="flex gap-4 flex-1">
                  {/* Icon Container */}
                  <div className="hidden sm:flex h-12 w-12 rounded-full bg-gray-50 items-center justify-center flex-shrink-0 border border-gray-100">
                    {getCategoryIcon(issue.category)}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors capitalize">
                        {issue.title}
                      </h3>
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                      {issue.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500">
                      <span className={`px-2.5 py-1 rounded-md border font-medium ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </span>
                      
                      <div className="flex items-center gap-1.5">
                        <MapPin size={16} className="text-gray-400" />
                        <span>Lat: {issue.location.split(',')[0]}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Calendar size={16} className="text-gray-400" />
                        <span>{issue.date}</span>
                      </div>

                      <div className="flex items-center gap-1.5 hover:text-indigo-600 cursor-pointer transition-colors">
                        <ThumbsUp size={16} />
                        <span>{issue.votes}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end mt-4 md:mt-0 pl-0 md:pl-4 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 ${statusConfig.style}`}>
                    <StatusIcon size={14} />
                    {statusConfig.label}
                  </span>
                  
                  {/* Mobile View Icon */}
                  <div className="md:hidden">
                     {getCategoryIcon(issue.category)}
                  </div>
                </div>

              </div>
            </div>
          );
        })}

        {filteredIssues.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No issues found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllIssues;