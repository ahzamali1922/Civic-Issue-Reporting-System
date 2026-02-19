import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';

// 1. Import all your actual pages
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ReportIssue from './pages/ReportIssue';
import AllIssues from './pages/AllIssues';
import AdminPanel from './pages/AdminPanel';
import IssueMap from './pages/IssueMap';
import MyReports from './pages/MyReports'; // We will build this next!

function App() {
  // Simple check for now (we can connect this to your Django backend later)
  const isAuthenticated = true; 

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes inside Layout */}
        <Route element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/report-issue" element={<ReportIssue />} />
          <Route path="/issues" element={<AllIssues />} />
          <Route path="/map" element={<IssueMap />} />
          <Route path="/my-reports" element={<MyReports />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;