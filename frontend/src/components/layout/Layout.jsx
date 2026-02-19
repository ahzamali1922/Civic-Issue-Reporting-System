import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, List, Map as MapIcon, FileText, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // Import the Auth hook!

const NavItem = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
      active 
        ? 'bg-indigo-50 text-indigo-700' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    <Icon size={18} />
    <span>{label}</span>
  </Link>
);

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Pull the real user and logout function from our AuthContext
  const { user, logout } = useAuth(); 

  const handleLogout = async () => {
    await logout(); // Kills the session
    navigate('/login'); // Sends them back to the login screen
  };

  // Safety check: if user hasn't loaded yet, don't crash
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            
            {/* Logo and Nav Links */}
            <div className="flex items-center gap-8">
              <Link to="/dashboard" className="flex items-center gap-2">
                <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
                  <FileText className="text-white" size={20} />
                </div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">CivicTrack</span>
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/dashboard'} />
                <NavItem to="/report-issue" icon={PlusCircle} label="Report Issue" active={location.pathname === '/report-issue'} />
                <NavItem to="/issues" icon={List} label="All Issues" active={location.pathname === '/issues'} />
                <NavItem to="/map" icon={MapIcon} label="Issue Map" active={location.pathname === '/map'} />
                <NavItem to="/my-reports" icon={FileText} label="My Reports" active={location.pathname === '/my-reports'} />
                
                {/* Only show Admin Panel if the logged-in user is staff */}
                {user.is_staff && (
                  <NavItem to="/admin-panel" icon={Shield} label="Admin Panel" active={location.pathname === '/admin-panel'} />
                )}
              </nav>
            </div>

            {/* User Profile & Logout */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm uppercase">
                  {/* Grabs the first letter of the real username */}
                  {user.username ? user.username.charAt(0) : '?'}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user.username}
                </span>
              </div>
              
              <button 
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-600 p-2 rounded-md hover:bg-red-50 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;