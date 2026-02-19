import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';

import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ReportIssue from './pages/ReportIssue';
import AllIssues from './pages/AllIssues';
import AdminPanel from './pages/AdminPanel';
import IssueMap from './pages/IssueMap';
import MyReports from './pages/MyReports';

// This component checks if the user is real before letting them see the page
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center text-indigo-600 font-medium">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes inside Layout */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/report-issue" element={<ReportIssue />} />
            <Route path="/issues" element={<AllIssues />} />
            <Route path="/map" element={<IssueMap />} />
            <Route path="/my-reports" element={<MyReports />} />
            <Route path="/admin-panel" element={<AdminPanel />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;