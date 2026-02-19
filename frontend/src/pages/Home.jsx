import React from 'react';
import { Link } from 'react-router-dom';
import { User, Shield } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Civic Issue Tracker</h1>
        <p className="text-gray-600 text-lg">Report, track, and resolve civic issues in your community.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Citizen Login Card */}
        <Link to="/login?type=citizen" className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all border border-gray-100 group">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <User className="text-blue-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Citizen Login</h2>
          <p className="text-gray-500">Report issues, track status, and view community reports.</p>
        </Link>

        {/* Admin Login Card */}
        <Link to="/login?type=admin" className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all border border-gray-100 group">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Shield className="text-purple-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Authority Login</h2>
          <p className="text-gray-500">Manage issues, assign tasks, and update resolution status.</p>
        </Link>
      </div>
    </div>
  );
};

export default Home;