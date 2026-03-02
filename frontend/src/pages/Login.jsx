import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, User, AlertCircle, Loader2, ArrowLeft, Shield, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth(); 
  
  const loginType = searchParams.get('type') || 'citizen'; 
  const isAdmin = loginType === 'admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      const userData = await login(username, password);
      if (isAdmin) {
        if (userData.is_staff) {
            navigate('/admin-panel');
        } else {
            setError("Access Denied: You do not have authority privileges.");
        }
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      
      {/* --- Ambient Background Effects --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob ${isAdmin ? 'bg-purple-300' : 'bg-blue-300'}`}></div>
        <div className={`absolute top-1/3 right-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000 ${isAdmin ? 'bg-indigo-300' : 'bg-cyan-300'}`}></div>
        <div className={`absolute -bottom-32 left-1/3 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000 ${isAdmin ? 'bg-fuchsia-300' : 'bg-sky-300'}`}></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-fade-in-up">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 mb-8 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        
        <div className="flex justify-center">
          <div className={`p-4 rounded-2xl shadow-inner ${isAdmin ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
            {isAdmin ? <Shield size={36} /> : <Users size={36} />}
          </div>
        </div>
        <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900 tracking-tight">
          {isAdmin ? 'Authority Portal' : 'Citizen Login'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 font-medium">
          {isAdmin ? 'Authorized personnel access only' : 'Sign in to report and track neighborhood issues'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-fade-in-up [animation-delay:200ms]">
        {/* Glassmorphic Card */}
        <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl shadow-gray-200/50 sm:rounded-3xl sm:px-10 border border-white">
          
          {error && (
            <div className="mb-6 bg-red-50/80 backdrop-blur-sm border-l-4 border-red-500 p-4 rounded-r-lg flex items-center gap-3 animate-fade-in">
              <AlertCircle className="text-red-500" size={20} />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Username / Email</label>
              <div className="relative group">
                <User className={`absolute left-3 top-3.5 transition-colors ${isAdmin ? 'text-purple-400 group-focus-within:text-purple-600' : 'text-blue-400 group-focus-within:text-blue-600'}`} size={20} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:outline-none transition-all ${isAdmin ? 'focus:ring-purple-500/20 focus:border-purple-500' : 'focus:ring-blue-500/20 focus:border-blue-500'}`}
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <div className="relative group">
                <Lock className={`absolute left-3 top-3.5 transition-colors ${isAdmin ? 'text-purple-400 group-focus-within:text-purple-600' : 'text-blue-400 group-focus-within:text-blue-600'}`} size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:outline-none transition-all ${isAdmin ? 'focus:ring-purple-500/20 focus:border-purple-500' : 'focus:ring-blue-500/20 focus:border-blue-500'}`}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 rounded-xl text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 hover:-translate-y-0.5 active:translate-y-0 ${
                isAdmin 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-500/30' 
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-blue-500/30'
              }`}
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Sign In Securely'}
            </button>
          </form>

          {!isAdmin && (
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500 font-medium rounded-full">
                    Don't have an account?
                  </span>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Link to="/signup" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                  Create an account now
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;