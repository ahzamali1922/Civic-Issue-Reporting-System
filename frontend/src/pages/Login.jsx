import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, User, AlertCircle } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Check the URL to see if it's ?type=admin or ?type=citizen
  const loginType = searchParams.get('type') || 'citizen'; 
  const isAdmin = loginType === 'admin';

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // MOCK LOGIN: Bypass backend for now and just navigate to the UI
    if (isAdmin) {
        navigate('/admin-panel');
    } else {
        navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isAdmin ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
            {isAdmin ? <Lock size={32} /> : <User size={32} />}
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {isAdmin ? 'Authority Login' : 'Citizen Login'}
          </h2>
          <p className="text-gray-500 mt-2">Enter your credentials to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-white font-medium shadow-sm transition-colors ${
              isAdmin 
                ? 'bg-purple-600 hover:bg-purple-700' 
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

// THIS LINE IS CRITICAL - It prevents the "Element type is invalid" error
export default Login;