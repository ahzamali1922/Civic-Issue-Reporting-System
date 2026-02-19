import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  ThumbsUp, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  MoreVertical 
} from 'lucide-react';
import api from '../services/api';

const AllIssues = () => {
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  
  // Mock Data (Replace with API call: const [issues, setIssues] = useState([]);)
  const [issues, setIssues] = useState([
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

  // Filter Logic
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || issue.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || issue.category === categoryFilter;
    const matchesSeverity = severityFilter === 'All' || issue.priority === severityFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesSeverity;
  });

  // Helper for Badge Colors
  const getStatusColor = (status) => {
    switch(status) {
      case 'Submitted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Assigned': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getCategoryIcon = (category) => {
    // You can add specific icons for each category here
    return <AlertCircle className="text-gray-500" size={20} />;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">All Issues</h1>
        <p className="text-gray-500 mt-1">{filteredIssues.length} issues found</p>
      </div>

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
            <option value="Submitted">Submitted</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:border-indigo-500 outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Pothole">Pothole</option>
            <option value="Garbage">Garbage</option>
            <option value="Water Leakage">Water Leakage</option>
            <option value="Streetlight">Streetlight</option>
          </select>

          <select 
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:border-indigo-500 outline-none cursor-pointer"
          >
            <option value="All">All Severity</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {filteredIssues.map((issue) => (
          <div key={issue.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
              
              <div className="flex gap-4 flex-1">
                {/* Icon Container */}
                <div className="hidden sm:flex h-12 w-12 rounded-full bg-gray-50 items-center justify-center flex-shrink-0">
                  {getCategoryIcon(issue.category)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
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
                      <span>{issue.location}</span>
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
                <span className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 ${getStatusColor(issue.status)}`}>
                  {issue.status === 'Resolved' ? <CheckCircle size={14} /> : <Clock size={14} />}
                  {issue.status}
                </span>
                
                {/* Mobile View Icon (visible only on small screens) */}
                <div className="md:hidden">
                   {getCategoryIcon(issue.category)}
                </div>
              </div>

            </div>
          </div>
        ))}

        {filteredIssues.length === 0 && (
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